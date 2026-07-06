# Formulários e Padrões Modais

## Índice

- [FocusModal x Drawer](#focusmodal-x-drawer)
- [Padrões de botões de edição](#padroes-de-botoes-de-edicao)
  - [Botão de edição simples (canto superior direito)](#padroes-de-botoes-de-edicao)
  - [Menu suspenso com ações](#formulario-com-validacao-e-estados-de-carregamento)
- [Componente Select para conjuntos de dados pequenos](#componente-select-para-conjuntos-de-dados-pequenos)
- [Exemplo do FocusModal](#exemplo-do-focusmodal)
- [Exemplo do Drawer](#exemplo-do-focusmodal)
- [Formulário com validação e estados de carregamento](#formulario-com-validacao-e-estados-de-carregamento)
- [Padrões de formulários principais](#padroes-chave-de-formularios)

## FocusModal x Drawer

**FocusModal**

- Use para criar novas entidades:

- Modal em tela cheia
- Mais espaço para formulários complexos
- Mais adequado para fluxos com várias etapas

**Drawer**

- Use para editar entidades existentes:

- Painel lateral que desliza da direita
- Edições rápidas sem perder o contexto
- Mais adequado para atualizações de um único campo

**Regra geral:** FocusModal para criação, Drawer para edição.

## Padrões de botões de edição

Os dados exibidos em um contêiner não devem ser editáveis diretamente. Em vez disso, use um botão “Editar”. Ele pode ser:

### Botão “Editar” simples (canto superior direito)

```tsx
import { Button } from "@medusajs/ui"
import { PencilSquare } from "@medusajs/icons"

<div className="flex items-center justify-between px-6 py-4">
  <Heading level="h2">Section Title</Heading>
  <Button
    size="small"
    variant="secondary"
    onClick={() => setOpen(true)}
  >
    <PencilSquare />
  </Button>
</div>
```

### Menu suspenso com ações

```tsx
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons"
import { DropdownMenu, IconButton } from "@medusajs/ui"

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton size="small" variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="gap-x-2">
          <PencilSquare className="text-ui-fg-subtle" />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item className="gap-x-2">
          <Plus className="text-ui-fg-subtle" />
          Add
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2">
          <Trash className="text-ui-fg-subtle" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
```

## Componente Select para conjuntos de dados pequenos

Para selecionar entre 2 e 10 opções (status, tipos etc.), use o componente Select:

```tsx
import { Select } from "@medusajs/ui"

<Select>
  <Select.Trigger>
    <Select.Value placeholder="Select status" />
  </Select.Trigger>
  <Select.Content>
    {items.map((item) => (
      <Select.Item key={item.value} value={item.value}>
        {item.label}
      </Select.Item>
    ))}
  </Select.Content>
</Select>
```

**Para conjuntos de dados maiores** (produtos, categorias, regiões etc.), use o DataTable com o FocusModal para pesquisa e paginação. Consulte [table-selection.md](table-selection.md) para ver o padrão completo.

## Exemplo do FocusModal

```tsx
import { FocusModal, Button, Input, Label } from "@medusajs/ui"
import { useState } from "react"

const MyWidget = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ title: "" })

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData)
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Create New
      </Button>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <div className="flex h-full flex-col overflow-hidden">
            <FocusModal.Header>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancel
                  </Button>
                </FocusModal.Close>
                <Button size="small" onClick={handleSubmit}>
                  Save
                </Button>
              </div>
            </FocusModal.Header>

            <FocusModal.Body className="flex-1 overflow-auto">
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                {/* More form fields */}
              </div>
            </FocusModal.Body>
          </div>
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}
```

## Exemplo de gaveta

```tsx
import { Drawer, Button, Input, Label } from "@medusajs/ui"
import { useState } from "react"

const MyWidget = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ title: data.title })

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData)
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Edit
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Settings</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body className="flex-1 overflow-auto p-4">
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              {/* More form fields */}
            </div>
          </Drawer.Body>

          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button size="small" variant="secondary">
                  Cancel
                </Button>
              </Drawer.Close>
              <Button size="small" onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  )
}
```

## Formulário com validação e estados de carregamento

```tsx
import { FocusModal, Button, Input, Label, Text, toast } from "@medusajs/ui"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

const CreateProductWidget = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [errors, setErrors] = useState({})
  const queryClient = useQueryClient()

  const createProduct = useMutation({
    mutationFn: (data) => sdk.admin.product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product created successfully")
      setOpen(false)
      setFormData({ title: "", description: "" })
      setErrors({})
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product")
    },
  })

  const handleSubmit = () => {
    // Validate
    const newErrors = {}
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.description) newErrors.description = "Description is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    createProduct.mutate(formData)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Create Product
      </Button>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <div className="flex h-full flex-col overflow-hidden">
            <FocusModal.Header>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button
                    size="small"
                    variant="secondary"
                    disabled={createProduct.isPending}
                  >
                    Cancel
                  </Button>
                </FocusModal.Close>
                <Button
                  size="small"
                  onClick={handleSubmit}
                  isLoading={createProduct.isPending}
                >
                  Save
                </Button>
              </div>
            </FocusModal.Header>

            <FocusModal.Body className="flex-1 overflow-auto">
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value })
                      setErrors({ ...errors, title: undefined })
                    }}
                  />
                  {errors.title && (
                    <Text size="small" className="text-ui-fg-error">
                      {errors.title}
                    </Text>
                  )}
                </div>

                <div className="flex flex-col gap-y-2">
                  <Label>Description *</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value })
                      setErrors({ ...errors, description: undefined })
                    }}
                  />
                  {errors.description && (
                    <Text size="small" className="text-ui-fg-error">
                      {errors.description}
                    </Text>
                  )}
                </div>
              </div>
            </FocusModal.Body>
          </div>
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}
```

## Padrões-chave de formulários

### Sempre desativar ações durante mutações

```tsx
<Button
  disabled={mutation.isPending}
  onClick={handleAction}
>
  Action
</Button>
```

### Mostrar o estado de carregamento no botão “Enviar”

```tsx
<Button
  isLoading={mutation.isPending}
  onClick={handleSubmit}
>
  Save
</Button>
```

### Limpar o formulário após o envio bem-sucedido

```tsx
onSuccess: () => {
  setFormData(initialState)
  setErrors({})
  setOpen(false)
}
```

### Validar antes do envio

```tsx
const handleSubmit = () => {
  const errors = validateForm(formData)
  if (Object.keys(errors).length > 0) {
    setErrors(errors)
    return
  }
  mutation.mutate(formData)
}
```

### Limpar erros de campo ao alterar a entrada

```tsx
<Input
  value={formData.field}
  onChange={(e) => {
    setFormData({ ...formData, field: e.target.value })
    setErrors({ ...errors, field: undefined }) // Clear error
  }}
/>
```
