const {BasicCard, Button ,Suggestions, Image} = require('actions-on-google')
//const rp = require('request-promise');
module.exports = {
    register : function(conv) {
        conv.ask(`Tickets shall be available shortly. Subscribe to notifications to receive updates.`);
        // conv.ask(new BasicCard({
        //     text: 'DroidCon India 2019',
        //     buttons: new Button({
        //         title: `REGISTER HERE`,
        //         url: '',
        //     }),
        //     image: new Image({
        //         url: '',
        //         alt: 'DroidCon India 2019',
        //     }),
        // }));
        conv.ask(new Suggestions(['Notify me'],['Call for speakers'],['Exit']));
    },
}