# Checkout Flow – Reference

Guidance for implementing the checkout flow in the YSH Store storefront. This reference documents the architecture, surface steps, B2B approval logic, and patterns established in the codebase.

## Decision Framework: Checkout Strategy

### Multi-Step Checkout (Current Implementation)

**Use when:**
- Complex B2B flows with approval requirements
- Multiple data collection points (company, address, shipping, billing, contact, payment)
- Progressive disclosure reduces cognitive load

**YSH Store uses 4 surface steps** (mapped from internal step IDs):

| Surface Step | Internal Steps Covered | Description |
|---|---|---|
| `address` | `shipping-address`, `billing-address`, `contact-information` | All address and contact data |
| `delivery` | `delivery` | Shipping method selection |
| `payment` | `payment` | Payment method selection |
| `review` | `review` | Final order confirmation |

> ⚠️ The UI stepper may display more labels than surface steps (e.g., Entrega, Faturamento, Frete, Contato, Pagamento). The surface step system is the authoritative state machine; the stepper is presentational only.

---

## Architecture

### Server/Client Split

```
CheckoutWorkspace (server)          → fetches shipping/payment methods from Medusa
  └── CheckoutWorkspaceClient (client) → manages all UI state, step transitions, form data
        ├── Address step UI
        ├── Delivery step UI
        ├── Payment step UI
        └── Review step UI
```

**Why this split matters:**
- `CheckoutWorkspace` fetches `listCartShippingMethods` and `listCartPaymentMethods` server-side, avoiding client waterfalls
- `CheckoutWorkspaceClient` is a "use client" component that holds all interactive state
- Overrides (`availableShippingMethodsOverride`, `availablePaymentMethodsOverride`) allow E2E testing without a live backend

### Surface Steps Logic (`lib/surface-steps.ts`)

```typescript
// Step order is authoritative – do not reorder
const CHECKOUT_SURFACE_STEP_ORDER: CheckoutSurfaceStep[] = [
  "address",
  "delivery",
  "payment",
  "review",
]

// Resolves which step to show based on cart state + URL ?step= param
export const resolveCheckoutSurfaceState = (cart, rawStep) => {
  const furthestAccessibleStep = getCheckoutSurfaceStepFromCart(cart)
  const requestedStep = normalizeCheckoutSurfaceStep(rawStep)
  // ...
}
```

**Key invariant:** A customer can never jump ahead of `furthestAccessibleStep`. Steps become accessible as the cart progresses.

---

## B2B Approval Flow

The YSH Store checkout has B2B-specific logic:

```typescript
// In CheckoutWorkspace (server)
const requiresApproval =
  cart.company?.approval_settings?.requires_admin_approval ||
  cart.company?.approval_settings?.requires_sales_manager_approval

const isApprovedAdmin =
  customer?.employee?.is_admin &&
  cart.approval_status?.status === ApprovalStatusType.APPROVED
```

### Payment Step Locking

- When `requiresApproval && !isApprovedAdmin` → `paymentLocked = true`
- When payment is locked, the payment step is not rendered
- An `ApprovalStatusBanner` shows the pending approval state
- Admin users with approved status bypass the lock

### Review Step Spending Limit

```typescript
// In Review component
const spendLimitExceeded = customer ? checkSpendingLimit(cart, customer) : false

// If exceeded → show warning + disabled "Revisar aprovacao" button
// If within limit → show PaymentButton (place order)
```

---

## Checkout Page

### Route

```
app/[countryCode]/(checkout)/checkout/page.tsx
```

### E2E Local Fixture Mode

The checkout page supports local fixture mode for E2E testing without a live backend:

```typescript
const isLocalE2EMode = isLocalE2EModeEnabled()
const localFixture = isLocalE2EMode
  ? getLocalCheckoutFixture(resolvedSearchParams?.fixture)
  : null

const cart = localFixture?.cart ?? (await retrieveCart(cartId))
const customer = localFixture?.customer ?? (await retrieveCustomer())
```

**Pattern:** Always guard `localFixture` behind `isLocalE2EModeEnabled()` — this flag should never be active in production.

---

## Fetching Payment Methods

**CRITICAL:** Always fetch payment methods from Medusa by region ID — never hardcode.

```typescript
// In CheckoutWorkspace (server)
const availablePaymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
```

**Why:** Payment providers vary per region. Hardcoding causes checkout to break when regions change.

---

## Checkout Stepper Component

The stepper is presentational — it reads `?step=` from URL params.

```typescript
const CHECKOUT_STEPS = [
  { id: "shipping-address", label: "Entrega" },
  { id: "billing-address", label: "Faturamento" },
  { id: "delivery", label: "Frete" },
  { id: "contact-details", label: "Contato" },
  { id: "payment", label: "Pagamento" },
] as const
```

**Key accessibility requirement:** Each step circle uses `aria-current="step"` when active.

---

## Step Navigation Pattern

Navigation between steps uses `useRouter` + `useSearchParams`:

```typescript
const createQueryString = useCallback(
  (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  },
  [searchParams]
)

// Navigate forward
router.push(pathname + "?" + createQueryString("step", "delivery"), {
  scroll: false,
})
```

**Use `scroll: false`** on all step transitions to prevent page jump. The checkout layout is a single-page flow where step content replaces inline without scroll-to-top.

---

## Payment Integration

### Stripe

```typescript
// Check if provider is Stripe-like
const isStripeLike = (providerId: string) => providerId.startsWith("pp_stripe")

// Stripe-specific UX
if (isStripeLike(selectedPaymentMethod) && !activeSession) {
  // Show CardElement for card input
  // Only route to review after card data is captured
}
```

### Payment Session Initiation

```typescript
await initiatePaymentSession(cart, {
  provider_id: selectedPaymentMethod,
})
```

**Pattern:** Always call `initiatePaymentSession` when the provider changes OR when there is no active session.

### Payment Wrapper

`PaymentWrapper` provides Stripe context to the entire checkout:

```typescript
// app/[countryCode]/(checkout)/checkout/page.tsx
<Wrapper cart={cart}>
  <CheckoutWorkspace ... />
</Wrapper>
```

The `StripeContext` (via `useContext`) is available throughout the checkout tree.

---

## Address Forms

### Shipping Address

```typescript
// Component: modules/checkout/components/shipping-address
// Form: modules/checkout/components/shipping-address-form
```

- Saves via `setShippingAddress(cart.id, addressPayload)`
- Countries are fetched from `cart.region?.countries` — **NEVER show all countries**, only the region's countries
- Persists address to `localStorage` for pre-fill on return visits

### Billing Address

```typescript
// Component: modules/checkout/components/billing-address
// Form: modules/checkout/components/billing-address-form
```

- Supports "same as shipping" toggle
- Independent address form when billing differs from shipping
- Uses `updateCart` to persist billing address

### Address Select (Saved Addresses)

```typescript
// Component: modules/checkout/components/address-select
```

- For authenticated users with saved addresses
- Populates form fields from selected address

---

## Company Step (B2B)

```typescript
// Component: modules/checkout/components/company
// Form: modules/checkout/components/company-form
```

- Shown when `cart?.company` exists
- Collects company name, registration number, tax ID
- Required before proceeding to shipping address

---

## Checkout Totals

```typescript
// Component: modules/checkout/components/checkout-totals
```

- Displays subtotal, shipping, taxes, discount, gift card, total
- Uses `convertToLocale` for price formatting
- **Do NOT divide prices by 100** — Medusa prices are in display format

---

## Error Handling

```typescript
// Component: modules/checkout/components/error-message
```

- All async step actions catch errors and set `error` state
- `ErrorMessage` component renders below submit button
- Reset `error` to `null` whenever `isOpen` changes (step focus changes)

---

## Common Mistakes to Avoid

- ❌ **Fetching payment methods client-side** — fetch server-side in `CheckoutWorkspace` to avoid waterfall
- ❌ **Showing all countries** — only show `cart.region?.countries`
- ❌ **Hardcoding payment providers** — always use `listCartPaymentMethods(region_id)`
- ❌ **Jumping steps** — always enforce `furthestAccessibleStep` from surface steps logic
- ❌ **Skipping `scroll: false`** on step navigation — causes jarring scroll-to-top
- ❌ **Placing order before payment session** — ensure `initiatePaymentSession` completes before routing to review
- ❌ **Dividing prices by 100** — Medusa stores prices as display values
- ❌ **Not clearing cart state after order** — after successful order placement, invalidate cart context/cache

---

## Checkout Summary Panel

```typescript
// Template: modules/checkout/templates/checkout-summary
```

- Shows cart items, quantities, and totals in a sidebar (desktop) or collapsible panel (mobile)
- Includes `PromotionCode` component for discount code entry
- Stays visible across all checkout steps

---

## Testing Checkout

### Unit Tests

- Test `resolveCheckoutSurfaceState` logic with various cart states
- Test `normalizeCheckoutSurfaceStep` edge cases
- Test `canAccessCheckoutSurfaceStep` ordering

### E2E Tests

- Use local fixture mode (`isLocalE2EModeEnabled()`) for deterministic checkout tests
- Fixture provides cart, customer, shipping methods, and payment methods
- See `e2e/checkout-flow.spec.ts` for existing E2E test patterns

### Manual Verification Checklist

- [ ] Cannot navigate to a step beyond what cart state allows
- [ ] Payment methods load from Medusa (not hardcoded)
- [ ] Countries dropdown only shows region's countries
- [ ] Stripe card element appears for Stripe provider
- [ ] B2B payment lock works when approval required
- [ ] Spend limit warning shows when exceeded
- [ ] Order places successfully and cart clears
- [ ] Mobile layout does not have scroll/overflow issues
