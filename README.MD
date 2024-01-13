# API utilizando Multer e SW3 em Node.js

Esta API em Node.js utiliza Multer para lidar com uploads de arquivos e SW3 para armazenamento em nuvem. Oferece uma solução eficiente e escalável para o gerenciamento de uploads de arquivos.

## Configuração

Antes de começar a utilizar a API, siga os passos abaixo:

1. **Instalação de Dependências:**
   Execute o seguinte comando para instalar as dependências necessárias:

   ```bash
   npm install
   ```

# Configuração do SW3

SW3_ACCESS_KEY=sua_access_key
SW3_SECRET_KEY=sua_secret_key
SW3_BUCKET=seu_bucket

# Configuração do Multer

# Verifique o arquivo `multerConfig.js` para ajustar configurações como o diretório de armazenamento local e os tipos de arquivo permitidos.

# POST /upload

curl -X POST -H "Content-Type: multipart/form-data" -F "file=@caminho/do/arquivo.txt" http://localhost:3000/upload

# GET /download/:filename

curl -o arquivo_baixado.txt http://localhost:3000/download/nome_do_arquivo.txt
