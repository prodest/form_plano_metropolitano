// Para tratar o deploy em homologação e produção, sem precisar ficar alterando o valor de System.config -> map.app
let orchardModulePath = '';
let redirectPopup = '';
if ( this.location && ( this.location.host.indexOf( 'condevit' ) >= 0 || this.location.host.indexOf( 'planometropolitano' ) >= 0 ) ) {
    orchardModulePath = 'Media/_external_modules/form_plano_metropolitano/app/';
    redirectPopup = 'http://condevit.dchm.es.gov.br/' + orchardModulePath;
} else {
    orchardModulePath = '';
    redirectPopup = 'http://localhost:3000/build/src/app/login/popup-callback/';
}

export const settings: Settings = {
    authentication: {
        authority: 'https://acessocidadao.es.gov.br/is/',
        client_id: '42775363-de48-432d-8def-c55154402d0a',
        redirect_uri: redirectPopup + 'popup-callback.template.html',
        response_type: 'id_token token',
        scope: 'openid'
    },

    apiBaseUrl: 'http://10.243.9.12/api/v1',

    orchardModulePath: orchardModulePath
};

interface Settings {
    authentication: {
        authority: string,
        client_id: string,
        redirect_uri: string,
        post_logout_redirect_uri?: string,
        response_type: string,
        scope: string
    };

    apiBaseUrl: string;

    orchardModulePath: string;
}
