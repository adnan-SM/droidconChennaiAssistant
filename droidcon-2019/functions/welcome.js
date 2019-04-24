const {Suggestions,LinkOutSuggestion} = require('actions-on-google');

module.exports={
    welcome: function(conv){
        if(conv.user.last.seen){
            conv.ask(`Welcome Back ! How can I help you ?`);
            conv.ask(new Suggestions(['Call For Speakers'],['Send me updates'],['Register Now'],['View Details'],['About Venue']));
        }
        else{
            conv.ask(" Welcome to DroidCon India 2019");
            conv.ask("Consider me your guide to DroidCon India, I can help you to plan for DroidCon like when it is Happening or How to register for it.");
            conv.ask(new Suggestions(['Call For Speakers'],['Send me updates'],['View Details'],['Register Now'],['About Venue']));

        }
    }
}