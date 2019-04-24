const {Suggestions,LinkOutSuggestion,BasicCard,Button,Image} = require('actions-on-google');
module.exports={
    details: function(conv){
        if(!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')){
            conv.ask("Droidcon is the largest global network of developer conferences which bring together the industry's foremost experts dedicated to advancing the Android platform. Droidcon engages a global network of over 25,000 developers attending our events in 22 cities. Our first droidcon conference was held in 2009 in Berlin and since then it has spread its influence across the globe and has established itself as the world's foremost community-driven conference format. Droidcon is the place to meet the international Android community, learn from expert speakers and dive into the latest Android advances and explore cutting edge technologies.This year, droidcon India is happening in Chennai. Be sure to grab your seats for an exciting two-day conference full of Android. ");

            return;
        }
        conv.ask("Here is more detailed info about DroidCon India");
        conv.ask(new BasicCard({
            text: "Droidcon is the largest global network of developer conferences which bring together the industry's foremost experts dedicated to advancing the Android platform. Droidcon engages a global network of over 25,000 developers attending our events in 22 cities. Our first droidcon conference was held in 2009 in Berlin and since then it has spread its influence across the globe and has established itself as the world's foremost community-driven conference format. Droidcon is the place to meet the international Android community, learn from expert speakers and dive into the latest Android advances and explore cutting edge technologies.This year, droidcon India is happening in Chennai. Be sure to grab your seats for an exciting two-day conference full of Android. ",
            title : "DroidCon India 2019",
            subtitle : "Nov 2nd-3rd | Chennai",
            buttons: new Button({
                title : "Know more",
                url: "https://www.in.droidcon.com/"
            }),
            image: new Image({
                url : "https://i.ibb.co/gyLnrkr/image.jpg",
                alt : "Droid Con poster"
            }),
            
        })),
        conv.ask(" What would you like to know now?");
        conv.ask(new Suggestions(['Call For Speakers'],['Register Now'],['Give me updates']));


    },
    venue : function(conv) {
        conv.ask('This year DroidCon would be held at Chennai. Exact location details would be available shortly. You can subscribe to notificaitons for receiving updates.');
    //     conv.ask(new BasicCard({
    //     text: `The University of Engineering & Management (UEM), Kolkata is a private university located in Action Area - III of New Town, Kolkata. It provides engineering, technological & management education`,
    //     image: new Image({
    //         url: `https://thumb.ibb.co/gh4gB9/cropped-uem.png`,
    //         alt:  `UEM Kolkata`,
    //     }),
    //     buttons: new Button({
    //         title: 'Find UEM on Google Maps',
    //         url: `https://www.google.com/maps/search/?api=1&query=uem+kolkata`,
    //     }),
    // }));
    conv.ask(new Suggestions(['Details'],['Notify me'],['Exit']));
    },
}