import re

def get_codeblocks(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        return re.findall(r'```[\s\S]*?```', content)
    except FileNotFoundError:
        return []

src_b = get_codeblocks('plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/breadcrumbs.md')
tgt_b = get_codeblocks('plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/breadcrumbs.pt-br.md')
print(f'breadcrumbs: src {len(src_b)} vs tgt {len(tgt_b)}')

src_f = get_codeblocks('plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/footer.md')
tgt_f = get_codeblocks('plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/footer.pt-br.md')
print(f'footer: src {len(src_f)} vs tgt {len(tgt_f)}')
