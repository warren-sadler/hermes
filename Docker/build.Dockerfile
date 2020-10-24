FROM amazonlinux as build
COPY . .
RUN chmod -R 755 ./scripts
RUN ./scripts/install.sh
FROM build as node_build
RUN npm install
CMD npm run build:production