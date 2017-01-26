export const settings: Settings = {
    authentication: {
        authority: 'https://acessocidadao.es.gov.br/is/',
        client_id: '42775363-de48-432d-8def-c55154402d0a',
        redirect_uri: 'http://localhost:3000/src/app/login/popup-callback/popup-callback.template.html',
        response_type: 'id_token token',
        scope: 'openid'
    },

    apiBaseUrl: 'http://10.243.9.12/api/v1'
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
}
