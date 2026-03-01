{ pkgs }: {
  name = "react-app";
  packages = [
    pkgs.nodejs-18_x
  ];
  enterShell = ''
    cd workspace
    npm install
  '';
  run = ''
    cd workspace
    npm run dev
  '';
}
