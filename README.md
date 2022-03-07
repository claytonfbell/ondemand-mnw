# ondemand-mnw

<https://ondemand.montessori-nw.org>

## Go Live Notes

1. Turn off app with command `pm2 stop nextjs`
2. Make snapshot at Digital Ocean
3. `git pull`
4. `rm -rf node_modules && yarn install && yarn build`
5. Run `npx prisma migrate dev --name init`
6. Turn on app with command `pm2 start nextjs`
7. Run the `/api/scrape?ck=xxxxxxxxxxx` cron twice or more times
