'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {dialogflow,UpdatePermission,
    Suggestions,BasicCard,Button}=require('actions-on-google');

const app = dialogflow({debug:true})
const welcome_mod=require('./welcome');
const cfs_mod=require('./cfs');
const details_mod=require('./details')

const PATH_TO_KEY='./secret.json'

admin.initializeApp();
const db=admin.firestore();

app.intent('Default Welcome Intent',(conv)=>{
    welcome_mod.welcome(conv);

})
app.intent('Call For Speakers',(conv)=>{
    cfs_mod.cfs(conv);
})
app.intent('Details',(conv)=>{
    details_mod.details(conv);
})

// *************************************************************************
//experimenting with stuff
const FirestoreNames={
    TIPS:'tips',
    CREATED_AT: 'created_at',
    TIP : 'tip',
    URL : 'url',
    USERS : 'users',
    INTENT : 'intent',
    USER_ID : 'userId'
    
}

const NOTIF_INTENT='tell_latest_tip';
// const PUSH_NOTIF_ASKED='push_notif_asked';
const PUSH_NOTIFICATION_ASKED = 'push_notification_asked';

app.intent(`tell_latest_tip`,(conv)=>{
    return db.collection(FirestoreNames.TIPS)
    .orderBy(FirestoreNames.CREATED_AT,'desc')
    .limit(1)
    .get()
    .then((querySnapshot)=>{
        const tip=querySnapshot.docs[0];
        const screenOutput= 
            conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
            if(!screenOutput){
                return conv.close(tip.get(FirestoreNames.TIP));
            }
            conv.ask(tip.get(FirestoreNames.TIP))
            conv.ask(new BasicCard({
                text : tip.get(FirestoreNames.TIP),
                buttons : new Button({
                    title : 'Know More',
                    url : tip.get(FirestoreNames.URL)
                }),
            }));

            // if(!conv.user.storage[PUSH_NOTIFICATION_ASKED]){        //can never be false if reached till this intent.
            //     conv.ask(new Suggestions('Alert me for DroidCon'));
            //     conv.user.storage[PUSH_NOTIFICATION_ASKED]=true;
              
            // }
            return console.log(`DB is working`);
    })
   // conv.ask(`Ok I'll notify you`);
})



app.intent(`setup_push`,(conv)=>{
    // conv.user.storage={}
    if(conv.user.storage[PUSH_NOTIFICATION_ASKED] === true)
    {
        conv.ask("You are already subscribed to notifications");
    }
    else{
        conv.ask(new UpdatePermission({intent: NOTIF_INTENT}))
    }
});


app.intent('finish_push_setup',(conv)=>{
    var userID;
    if(conv.arguments.get('PERMISSION')){
        if(conv.user.storage.userId)
        {
            userID = conv.user.storage.userId;
        }
        else
        {
            userID=conv.arguments.get('UPDATES_USER_ID');
            conv.user.storage.userId = userID;
        }
        
        return db.collection(FirestoreNames.USERS)
        .add({
            [FirestoreNames.INTENT] : NOTIF_INTENT,
            [FirestoreNames.USER_ID] : userID,
        }).then((docRef)=>{
            conv.ask(`Ok, I'll start alerting you about about DroidCon`);
            conv.user.storage[PUSH_NOTIFICATION_ASKED]=true; // change this value to true manually in your device
            conv.ask(new Suggestions('Do something else'));
            return console.log(`Alerting is done`);
        })
    }else{
        conv.ask(`Ok, I won't alert you.`);
        return conv.ask(new Suggestions('Do something else'));
        

    }
})
app.intent('unsubscribe',(conv)=>{
    if(conv.user.storage[PUSH_NOTIFICATION_ASKED] === false)
    {
        conv.ask("You are not yet subscribed to notifications ");
    }
    else
    {
        conv.user.storage[PUSH_NOTIFICATION_ASKED] = false;
        const userID=conv.user.storage.userId;
        console.log("USERID CHeck below..");
        console.log(userID);
        conv.ask(userID);
        db.collection("users").where('userId','==',`${userID}`).get()
        .then((querySnapshot)=>{
            if(querySnapshot.size>0){
                querySnapshot.forEach((doc)=>{
                    doc.ref.delete()
                });
            }
            return;
        }).catch((error)=>{
            throw new Error(`FireStore query error : ${error}`);
        });
        conv.ask("Unsubscribed successfully . . .")
    }
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
//authorizing user
/**
 * Everytime a tip is added to the Firestore DB, this function runs and sends
 * notifications to the subscribed users.
 **/

exports.createTip=functions.firestore
    .document(`${FirestoreNames.TIPS}/{tipsId}`)
    .onCreate((snap,context)=>{
        const {JWT} = require('google-auth-library');
        const request = require('request');
        const key = require(PATH_TO_KEY);
        let jwtClient = new JWT(
            key.client_email, null, key.private_key,
            ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
            null
        );
            let notification = {
                userNotification: {
                title: 'DroidCon India',
                },
           
                target:{},
            };
            jwtClient.authorize((authErr, tokens) => {
              if(authErr){
                  throw new Error(`Auth error: ${authErr}`);
              }
              db.collection(FirestoreNames.USERS)
              .where(FirestoreNames.INTENT,'==',NOTIF_INTENT)
              .get()
              .then((querySnapshot)=>{
                  querySnapshot.forEach((user)=>{
                      notification.target={
                          userId : user.get(FirestoreNames.USER_ID),
                          intent : user.get(FirestoreNames.INTENT)
                      };
                       
                    request.post('https://actions.googleapis.com/v2/conversations:send', {
                        'auth': {
                            'bearer': tokens.access_token,
                        },
                        'json': true,
                        'body': {
                            'customPushMessage': notification
                        },
                    },
                        (reqErr, httpResponse, body) => {
                            if(reqErr){
                                throw new Error(`API request error: ${reqErr}`);
                            }
                            console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
                            console.log(JSON.stringify(body));
                       });
                   });  
                   return console.log(`Everything is done`) ;
                  }).catch((error)=>{
                      throw new Error (`Firestore query error: ${error}`);
                  });
              });
    return console.log(`Everything is done ... `);
});

//use this function to restore the content of tips database.

exports.restoreTipsDB= functions.https.onRequest((request,response)=>{
    db.collection(FirestoreNames.TIPS)
    .get()
    .then((querySnapshot)=>{
        if(querySnapshot.size>0){
            let batch = db.batch();
            querySnapshot.forEach((doc)=>{
                batch.delete(doc.ref);
            });
            batch.commit()
            // .then( addTips);
                .then(addTips).catch((err)=>{throw new Error(`FireStore query error : ${err}`);});
        }
        return;
    }).catch((error)=>{
        throw new Error(`FireStore query error : ${error}`);
    })
    addTips();

    //add tips
    function addTips(){
        const tips= require('./tipsDB.json');
        let batch=db.batch();
        let tipsRef=db.collection(FirestoreNames.TIPS);
        tips.forEach((tip)=>{
            let tipRef=tipsRef.doc();
            batch.set(tipRef,tip);
        });
        batch.commit()
            .then(()=>{
                //request.setEncoding(`Tips DB succesfully restored`);
                response.send("Tips DB successfully updated . . .");
                console.log("Updated db");
                return ;
            })
            .catch((error)=>{
                throw new Error(`Error restoring tips DB: ${error}`);
            });
    }
})






  


