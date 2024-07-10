# Imagen de node
FROM node:alpine

# Set del working directory
WORKDIR /usr/scr/app

# Copiamos los archivos al contenedor
COPY . .

# Comando para correr el programa
RUN npm install

COPY . .

CMD [ "node", "app.js" ] 