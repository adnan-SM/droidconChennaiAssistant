const {Suggestions,LinkOutSuggestion,BasicCard,Button,Image} = require('actions-on-google');

module.exports={
    cfs: function(conv){
        if(!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')){
            conv.ask(" Sorry try this on a screen device , because you need to fill a form");
            return;
        }
        conv.ask(" Here you go ");
        conv.ask(new BasicCard({
            text: "Droidcon is the largest global network of developer conferences which bring together the industry's foremost experts dedicated to advancing the Android platform. Droidcon engages a global network of over 25,000 developers attending our events in 22 cities. We have differnt track like Android, FIrebase, Kotlin , AR, etc. We are encouraging you to Submit your talk.  ",
            title : "CALL FOR SPEAKERS",
            subtitle : "Last Date : 15 Aug 2019",
            buttons: new Button({
                title: " Submit your talk",
                url: "https://sessionize.com/droidcon-india-2019-in-chennai/",

            }),
            image: new Image({
                url: "https://i.ibb.co/gyLnrkr/image.jpg",
                alt : "DroidCon Image",
            }),
        }));
        conv.ask(new Suggestions(['View Details'],['About Venue']));

    }
}