with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line.startswith('jules='):
            val = line.split('=', 1)[1].strip(' "\'')
            print(f'Key length: {len(val)}')
            print(f'Key prefix: {val[:8]}...')
            break
    else:
        print('No jules= key found')
