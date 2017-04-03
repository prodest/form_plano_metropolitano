// Para tratar o deploy em homologação e produção, sem precisar ficar alterando o valor de System.config -> map.app
let apiBaseUrl = '';
let orchardModulePath = '';
let redirectCallback = '';
if ( this.location && ( this.location.host.indexOf( 'planometropolitano' ) >= 0 ) ) {
    orchardModulePath = 'Media/_external_modules/form_plano_metropolitano/app/';
    redirectCallback = 'http://condevit.es.gov.br/' + orchardModulePath;
    apiBaseUrl = 'https://api.es.gov.br/demands/api/v1';
} else if ( this.location && ( this.location.host.indexOf( 'condevit' ) >= 0 ) ) {
    orchardModulePath = 'Media/_external_modules/form_plano_metropolitano/app/';
    redirectCallback = 'http://condevit.dchm.es.gov.br/' + orchardModulePath;
    apiBaseUrl = 'https://api.es.gov.br/demands/api/v1';
} else {
    orchardModulePath = '';
    redirectCallback = 'http://localhost:3000/build/src/app/login/callback/';
    apiBaseUrl = 'https://api.es.gov.br/demands/api/v1';
}

export const settings: Settings = {
    authentication: {
        authority: 'https://acessocidadao.es.gov.br/is/',
        client_id: '42775363-de48-432d-8def-c55154402d0a',
        redirect_uri: redirectCallback + 'popup-callback.template.html',
        silent_redirect_uri: redirectCallback + 'silent-callback.template.html',
        post_logout_redirect_uri: redirectCallback + 'popup-callback.template.html',
        response_type: 'id_token token',
        scope: 'openid nome email'
    },
    apiBaseUrl: apiBaseUrl,
    orchardModulePath: orchardModulePath
};

interface Settings {
    authentication: {
        authority: string,
        client_id: string,
        redirect_uri: string,
        post_logout_redirect_uri?: string,
        silent_redirect_uri?: string,
        response_type: string,
        scope: string
    };

    apiBaseUrl: string;

    orchardModulePath: string;
}
