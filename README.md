# LastingMusicApp
Repositorio para la pagina e-commerce de LastingMusic

###  [LastingMusicApp](https://ramokami.github.io/LastingMusicApp/)
Una plataforma web e-commerce para la compra de Cd's de musica a nivel nacional (Chile), con el objetivo de expandir y facilitar la compra de musica en formato fisico.

<p align="center">
  <img src="../LastingMusicApp/LastingMusicFront/public/LastingMusicReadme.png" width="800">
</p>


```
Directory structure:
└── ramokami-lastingmusicapp/
    ├── README.md
    └── LastingMusicFront/
        ├── README.md
        ├── convert_cds.js
        ├── eslint.config.js
        ├── index.html
        ├── package.json
        ├── vite.config.js
        └── src/
            ├── App.css
            ├── App.jsx
            ├── index.css
            ├── main.jsx
            └── components/
                ├── AdminPanel.jsx
                ├── CartDrawer.jsx
                ├── CDCard.jsx
                ├── CDList.jsx
                ├── CDPlayerModal.jsx
                ├── Footer.jsx
                ├── Hero.jsx
                ├── LoginModal.jsx
                ├── Navbar.jsx
                ├── OrdersHistory.jsx
                ├── ProfileDashboard.jsx
                ├── ToastNotification.jsx
                └── admin/
                    ├── AdminCDTable.jsx
                    ├── AdminForm.jsx
                    └── AdminPreview.jsx

```

## Levantar Frontend
(IMPORTANTE) - Dentro del directorio - **LastingMusicFront**

Paso 1

```
npm i
```

Paso 2

```
npm run dev
```

## Deploy a Github Pages
(IMPORTANTE) - El comando hace Deploy instantaneo de cualquier Push a la rama main luego de ejecutarse.

```
npm run deploy
```
