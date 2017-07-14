# Memo

### Open Port on Ubuntu

open
``` command
sudo ufw enable
sudo ufw allow 3000
sudo ufw status
```

close
``` command
sudo ufw deny 3000
sudo ufw status
```

### Launch App with a Specific Port

``` command
PORT=12345 npm start
```
