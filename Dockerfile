FROM ansarada/nodelts-python:3.1.0

# Install node prereqs, nodejs and yarn
# Ref: https://deb.nodesource.com/setup_8.x
# Ref: https://yarnpkg.com/en/docs/install
# RUN \
#   apt-get update && \
#   apt-get install -yqq apt-transport-https
# RUN \
#   echo "deb https://deb.nodesource.com/node_8.x jessie main" > /etc/apt/sources.list.d/nodesource.list && \
#   wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
#   echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
#   wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
#   apt-get update && \
#   apt-get install -yqq nodejs yarn && \
#   rm -rf /var/lib/apt/lists/*



# RUN apt-get update -yq \
#     && apt-get install curl gnupg -yq \
#     && curl -sL https://deb.nodesource.com/setup_8.x | bash \
#     && apt-get install nodejs -yq


RUN mkdir -p /app
WORKDIR /app

COPY package.json .
RUN npm install 

# Bundle app source
COPY . /app


# transpila o projeto
# RUN npm install -g typescript
# RUN tsc  -p '/app/'


CMD [ "npm", "start" ]
