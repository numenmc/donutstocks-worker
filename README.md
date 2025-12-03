# donutstocks-worker
This is the thing I wrote to collect data from the auction house for my YouTube video.

## Running it
Install [NodeJS](https://nodejs.org/en/download), if asked if you want NPM, choose to install it.
Install [GIT](https://git-scm.com/install/).
Open a terminal (cmd/powershell/bash/whatever) and run each line one by one. If you get any errors stop and read the error.

> [!IMPORTANT]
> **Windows users:** if the line in your terminal starts with `C:/Windows/System32` or similar, and does not start with `C:/Users/your user here`, please run `cd %USERPROFILE%` to go to your user folder first.
>
> **Everyone else:** just make sure to do `cd ~` first, it is equivalent to the `cd` command for windows above.
>
> **All below commands should work no matter what OS you're on.**

```bash
git clone https://github.com/numenmc/donutstocks-worker.git
cd donutstocks-worker
npm install
npm start
```
### An explanation of the lines
`git clone ...` downloads the sourcecodes for the program into the `donutstocks-worker` folder whereever your terminal is currently located. `cd` means change directory, writing `cd donutstocks-worker` means move to the `donutstocks-worker` folder. `npm install` downloads necesary libraries (aka helper files) and `npm start` runs it.
