# Lab Framework Demo

This is a [Next.js](https://nextjs.org/) demo using [Tailwinds CSS](https://tailwindcss.com/), [MDX](https://mdxjs.com/), and [Next-MDX-Remote](https://github.com/hashicorp/next-mdx-remote) to provide interactive lab guides to students.

## Development

The lab framework requires third-party containers. As a result, this project utilizes [devcontainers](https://code.visualstudio.com/docs/devcontainers/containers) to enable real-time development without having to incur setup complexity.

Ensure you have the following prerequisites installed:

1. **Visual Studio Code:** Download and install the latest version of VSCode from the [official website](https://code.visualstudio.com/).
1. **Docker:** Install Docker on your machine. You can find the installation instructions for your operating system on the [Docker website](https://docs.docker.com/get-docker/).
1. **Visual Studio Code Extensions:** Install the **Dev Containers** extension in VSCode.

Once the prerequisites are installed, perform the following:

1. In the vscode command palette, select `Dev Containers: Rebuild Container`

1. Open a new bash terminal in vscode.

1. Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the lab markdown page by modifying `app/docs/nginx-one.mdx`. The page auto-updates as you edit the file.

## "Production" Docker Deployment

The lab framework runs in Docker, so the it must be installed in the host system. Additionally, the lab framework container will use the host's docker API to manage containers. The host system needs to expose the Docker API over a network so that the lab framework container can connect to it. This approach involves some setup and is more secure when properly configured, especially when using TLS for encrypted communication.

Assuming a host system of Ubuntu 22.04, docker can be installed using the following:

```shell
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

Once installed, you can configure Docker to expose its API over the network (if needed):

```shell
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "hosts": ["tcp://0.0.0.0:2375", "unix:///var/run/docker.sock"]
}
EOF

sudo mkdir /etc/systemd/system/docker.service.d/

sudo tee /etc/systemd/system/docker.service.d/override.conf > /dev/null <<'EOF'
# Disable flags to dockerd, all settings are done in /etc/docker/daemon.json
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd
EOF

sudo systemctl daemon-reload; sudo systemctl restart docker

# Open up permissions to host docker socket so container can interact with it
sudo chmod 0666 /var/run/docker.sock

```

A `docker-compose.yaml` file has been provided to orchestrate the lab framework and redis containers. In order for the lab framework to create additional containers required by the lab author, the docker calls need to specify a custom host via the `-H` parameter in order to connect to the hosts Docker API. Example:

```shell
docker -H tcp://host.docker.internal:2375 pull ubuntu
```
