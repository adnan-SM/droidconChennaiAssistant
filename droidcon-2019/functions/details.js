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
        conv.ask(" What you would like to know now?");
        conv.ask(new Suggestions(['Call For Speakers'],['Register Now'],['Organizers'],['About Venue']));


    }
}