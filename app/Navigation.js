/**
 * Programmatic Navigation and Page Transitions
 * with SwiperJS and AnimeJS
 */


/**
 * Variables globales de navegación
 * En estas variables guardamos elementos DOM para trabajar con ellos
 */
let links;
let sections;
let modals;


/**
 * Variables globales de animación
 * Las animaciones las podemos guardar aquí: 
 * animaciones del layout, animaciones de componentes concretos, etc...
 */
let animation_layout;


/**
 * @function navigationErrHandler
 * @param {Error} err  
 * Trata errores que se den en la navegación
 */
const navigationErrHandler = (err = "") => {
    if (err) {
        console.error("Ops! Something went wrong");
        console.error(err);
    }
};


/**
 * @function initNavigation
 * 
 * 
 * Inicializa la navegación SPA (Single Page Application)
 */
const initNavigationEvents = () => {
    links.forEach(link => {
        link.addEventListener('click', ev => {
            ev.preventDefault();

            const navigationType = link.getAttribute('navigation-type');
            const animationType = link.getAttribute('animation-type');
            const getTo = '#' + link.href.split('#').slice(-1);

            switch (navigationType) {
                case 'swipe':
                    swipeTo(getTo);
                    break;
                case 'animation':
                    navigationTo(getTo, animationType);
                    break;
                case 'modal':
                    popUpToggle(getTo, animationType);
                    break;
                default:
                    navigationErrHandler();
            }
        });
    });
};


/**
 * @function swipeTo
 * @param {String} getTo 
 * 
 * Función que controla la navegación con swiper.
 */
const swipeTo = (getTo = '#menu_page') => {

    console.log(getTo);

    /**
     * Navegar con swipes
     * podemos integrar el siguiente código para que el swipe funcione independientemente
     * de la cantidad de elementos navegables que tengamos o añadamos en el futuro
     * -----------------------
        let sections = document.querySelectorAll('swiper_item');
        let index = Array.from(sections).findIndex(section => '#' + section.id == getTo);
        swiper.slideTo(index);
     * -----------------------
     */
    switch (getTo) {
        case '#settings_page':
            swiper.slideTo(0)
            break;
        case '#menu_page':
            swiper.slideTo(1)
            break;
        case '#leaderboard_page':
            swiper.slideTo(2)
            break;
    }    

    if (!swiper) {
        navigationErrHandler(`No has programado la funcionalidad de Swiper todavía!`);
    }

    // clean up funcs
    GAME_UI.state.navigationStage = getTo;
};



/**
 * @function navigationTo
 * @param {String} getTo
 * @param {String} animationType
 * 
 * Función que controla la navegación general.
 * Esta función actualiza el state de la aplicación
 * Y lanza las animaciones que queramos en función del animationType.
 */
const navigationTo = (getTo, animationType) => {

    switch (animationType) {

        /**
         * Entrada de la app
         */
        case 'fade_in':
            animation_FadeIn(getTo);
            animation_layout.finished.then(() => {
                // Fake splash
                setTimeout(() => {
                    navigationTo('#swiper_page', 'splash_to_menu');
                }, 2000);
            });
            break;

        /**
         * Desde la pantalla splash al menu
         */
        case 'splash_to_menu':
            animation_SplashToMenu(getTo);
            break;

        case 'menu_to_game':
            animation_MenuToMain(getTo);
            break;
        
        case 'game_out':
            animation_ConfirmOut(getTo);
            animation_PopupContinue(getTo);
            animation_MainToMenu(getTo);
            break;
        
        
        /**
         * ErrHandler
         */
        default:
            navigationErrHandler(`No has programado el animation-type="${animationType}" todavía!`);
    }


    // clean up funcs
    GAME_UI.state.navigationStage = getTo;
};



/**
 * @function popUpToggle 
 * @param {String} getTo
 * @param {String} animationType
 * 
 * Función que controla la apertura y cierre de ventanas popup (salir del juego y confirmar).
 * Esta función actualiza el state de la aplicación
 * Y lanza las animaciones que queramos en función del animationType
 */
const popUpToggle = (getTo, animationType) => {

    switch (animationType) {
        /**
         * Lanzar popup de pausa en el juego
         */
        case 'pause_modal':
            animation_PopupPause(getTo);
            animation_layout.finished.then(() => {
                game.pauseOrResume();
            });
            break;

        case 'resume_modal':
            animation_PopupContinue(getTo);
            animation_layout.finished.then(() => {
                game.pauseOrResume();
            });
        break;
        
        case 'confirm_modal_in':
            animation_ConfirmIn(getTo);
            break;

        case 'confirm_modal_out':
            animation_ConfirmOut(getTo);
            animation_PopupContinue(getTo);
            break;
        /**
         * ErrHandler
         */
        default:
            navigationErrHandler(`No has programado el animation-type="${animationType}" todavía!`);
    }

    GAME_UI.state.navigationStage = getTo;
};





/**
 * @function show/hideSpinner
 * 
 * Función para sacar un spinner (ruedita dando vueltas) para 
 * procesos asíncronos de fetching
 * 
 */
const showSpinner = () => {
    GAME_UI.state.spinning = true;
    GAME_UI.modalWindows.spinner.classList.add('active');
};
const hideSpinner = () => {
    GAME_UI.state.spinning = false;
    GAME_UI.modalWindows.spinner.classList.remove('active');
};



/**
 * @function initNavigation
 * La ejecuto en main.js
 * 
*/
const initNavigation = () => {
    links = GAME_UI.app.querySelectorAll('a[href^="#"]');
    sections = GAME_UI.app.querySelectorAll('section');
    modals = GAME_UI.app.querySelector('modal_window');

    initNavigationEvents();
};
