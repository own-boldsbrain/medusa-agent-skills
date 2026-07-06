# Padrões de Formulários e Modais

## Conteúdo

- [FocusModal vs Drawer](#focusmodal-vs-drawer)
- [Padrões de Botão de Edição](#edit-button-patterns)
  - [Botão de Edição Simples (canto superior direito)](#simple-edit-button-top-right-corner)
  - [Menu Suspenso com Ações](#dropdown-menu-with-actions)
- [Componente Select para Pequenos Conjuntos de Dados](#select-component-for-small-datasets)
- [Exemplo FocusModal](#focusmodal-example)
- [Exemplo Drawer](#drawer-example)
- [Formulário com Estados de Validação e Carregamento](#form-with-validation-and-loading-states)
- [Padrões Chave de Formulário](#key-form-patterns)

## FocusModal vs Drawer

**FocusModal**- Use para criar novas entidades:

- Modal tela cheia
- Mais espaço para formulários complexos
- Melhor para fluxos de múltiplas etapas**Drawer**- Use para editar entidades existentes:

- Painel lateral que desliza pela direita
- Edições rápidas sem perder o contexto
- Melhor para atualizações de campo único**Regra geral:**FocusModal para criação, Drawer para edição.

## Padrões de Botão de Edição

Os dados exibidos em um container não devem ser editáveis diretamente. Em vez disso, use um botão "Editar". Isso pode ser:

### Botão de Edição Simples (canto superior direito)

```tsx
import { Button } from "@medusajs/ui"
import { PencilSquare } from "@medusajs/icons"

<div className="flex items-center justify-between px-6 py-4">
  <Heading level="h2">Título da Seção</Heading>
  <Button
    size="small"
    variant="secondary"
    onClick={() => setOpen(true)}
  >
    <PencilSquare />
  </Button>
</div >
```

### Menu Suspenso com Ações

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
          Editar
        </DropdownMenu.Item>
        <DropdownMenu.Item className="gap-x-2">
          <Plus className="text-ui-fg-subtle" />
          Adicionar
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2">
          <Trash className="text-ui-fg-subtle" />
          Excluir
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
```

## Componente Select para Pequenos Conjuntos de Dados

Para selecionar de 2 a 10 opções (status, tipos, etc.), use o componente Select:

```tsx
import { Select } from "@medusajs/ui"

<Select>
  <Select.Trigger>
    <Select.Value placeholder="Selecione o status" />
  </Select.Trigger>
  <Select.Content>
    {items.map((item) => (
      <Select.Item key={item.value} value={item.value}>
        {item.label}
      </Select.Item>
    ))}
  </Select.Content>
</Select>
```**Para conjuntos de dados maiores** (Produtos, Categorias, Regiões, etc.), use DataTable com FocusModal para busca e paginação. Consulte [table-selection.md](table-selection.md) para o padrão completo.

## Exemplo FocusModal

```tsx
import { FocusModal, Button, Input, Label } from "@medusajs/ui"
import { useState } from "react"

const MyWidget = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ title: "" })

  const handleSubmit = () => {
    // Lógica de envio do formulário
    console.log(formData)
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Criar Novo
      </Button>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <div className="flex h-full flex-col overflow-hidden">
            <FocusModal.Header>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancelar
                  </Button>
                </FocusModal.Close>
                <Button size="small" onClick={handleSubmit}>
                  Salvar
                </Button>
              </div >
            </FocusModal.Header>

            <FocusModal.Body className="flex-1 overflow-auto">
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                  <Label>Título</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div >
                {/*Mais campos do formulário*/}
              </div >
            </FocusModal.Body>
          </div >
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}
```

## Exemplo Drawer

```tsx
import { Drawer, Button, Input, Label } from "@medusajs/ui"
import { useState } from "react"

const MyWidget = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ title: data.title })

  const handleSubmit = () => {
    // Lógica de envio do formulário
    console.log(formData)
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Editar
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Editar Configurações</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body className="flex-1 overflow-auto p-4">
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div >
              {/*Mais campos do formulário*/}
            </div >
          </Drawer.Body>

          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button size="small" variant="secondary">
                  Cancelar
                </Button>
              </Drawer.Close>
              <Button size="small" onClick={handleSubmit}>
                Salvar
              </Button>
            </div >
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  )
}
```

## Formulário com Estados de Validação e Carregamento

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
      toast.success("Produto criado com sucesso")
      setOpen(false)
      setFormData({ title: "", description: "" })
      setErrors({})
    },
    onError: (error) => {
      toast.error(error.message || "Falha ao criar o produto")
    },
  })

  const handleSubmit = () => {
    // Validar
    const newErrors = {}
    if (!formData.title) newErrors.title = "O título é obrigatório"
    if (!formData.description) newErrors.description = "A descrição é obrigatória"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    createProduct.mutate(formData)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Criar Produto
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
                    Cancelar
                  </Button>
                </FocusModal.Close>
                <Button
                  size="small"
                  onClick={handleSubmit}
                  isLoading={createProduct.isPending}
                >
                  Salvar
                </Button>
              </div >
            </FocusModal.Header>

            <FocusModal.Body className="flex-1 overflow-auto">
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                  <Label>Título *</Label>
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
                </div >

                <div className="flex flex-col gap-y-2">
                  <Label>Descrição *</Label>
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
                </div >
              </div >
            </FocusModal.Body>
          </div >
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}
```

## Padrões Chave de Formulário

### Sempre Desabilitar Ações Durante Mutações

```tsx
<Button
  disabled={mutation.isPending}
  onClick={handleAction}
>
  Ação
</Button>
```

### Mostrar Estado de Carregamento no Botão de Envio

```tsx
<Button
  isLoading={mutation.isPending}
  onClick={handleSubmit}
>
  Salvar
</Button>
```

### Limpar Formulário Após Sucesso

```tsx
onSuccess: () => {
  setFormData(initialState)
  setErrors({})
  setOpen(false)
}
```

### Validar Antes de Enviar

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

### Limpar Erros de Campo ao Mudar o Input

```tsx
<Input
  value={formData.field}
  onChange={(e) => {
    setFormData({ ...formData, field: e.target.value })
    setErrors({ ...errors, field: undefined }) // Limpa erro
  }}
/>
```

## Casos de Uso Yello Solar Hub

- **Criação de Cotação B2B (FocusModal):**Utilizar o FocusModal para guiar o usuário por um fluxo de múltiplas etapas ao criar uma cotação complexa. O primeiro passo coleta informações do cliente (Dados Pessoa Jurídica), e o segundo passo exige o detalhamento dos equipamentos (Inversores, Módulos, Baterias), validando em tempo real se os códigos de produto são válidos no catálogo Medusa.
-**Atualização Rápida de Cadastro de Distribuidores (Drawer):**Quando um operador precisa ajustar o telefone ou o prazo de pagamento de um distribuidor parceiro, o Drawer é ideal. Ele permite ver o nome do distribuidor na tela principal enquanto o ajuste rápido dos dados ocorre no painel lateral, sem desviar o foco da planilha de gestão.
-**Aprovação Financeira de Kits Solares (Validation/Loading States):**Ao processar um pedido que requer aprovação comercial, o formulário de aprovação (dentro de um FocusModal) deve implementar validação de dados (ex: o valor total não pode ser negativo) e um estado de carregamento (`isLoading`) no botão "Confirmar Aprovação" para evitar cliques múltiplos durante a chamada da API financeira.
-**Seleção de Componentes em Catálogo (Select Component):** Ao montar um kit solar em um carrinho de cotação, o usuário precisa selecionar módulos, inversores ou estruturas. Como são conjuntos de tipos pré-definidos e pequenos (ex: Tipo A, Tipo B), o componente Select é usado, garantindo que o estoque e a compatibilidade sejam verificados na seleção inicial.stop
