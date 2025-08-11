# deploy.sh

# Pull the latest changes from the remote repository
git pull

# install dependencies
pnpm install


# remove the old build
rm -rf .next

# build the project
pnpm build

# start the project
pm2 restart the-polyclinic
