Reports = new Mongo.Collection("reports");

var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
    stores: [imageStore]
});

if (Meteor.isClient) {
    Template.takePhoto.events({
        'click .capture': function () {
            Tracker.autorun(function() {
                var location = Geolocation.latLng();
                if(location) {
                    console.log('set', location);
                    Session.set('location',location);
                    console.log('get', Session.get('location'));
                }
            });
            MeteorCamera.getPicture({}, function (error, data) {
                Session.set('photo', data);
            });
        },
        'click .report': function (event, template) {

            var description = template.find('.description').value;
            var location = Session.get('location');

            //console.log(imagesURL);
            console.log("Description: " + description);
            console.log("Location: " + location);

            var report = Reports.insert({
                description: description,
                location: location,
                created_at: new Date
            });

            FS.Utility.eachFile(event, function(file) {

                Images.insert(file, function (err, fileObj) {
                    if (err){
                        // handle error
                    } else {
                        // handle success depending what you need to do
                        var imagesURL = {
                            "report.image": "/cfs/files/images/" + fileObj._id
                        };
                        Reports.update(report._id, {$set: imagesURL});

                    }

                });
            });

            FlashMessages.sendSuccess("Report sent.");

        }
    });

    Template.takePhoto.helpers({
        'photo': function () {
            return Session.get('photo');
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    Images.deny({
        insert: function(){
            return false;
        },
        update: function(){
            return false;
        },
        remove: function(){
            return false;
        },
        download: function(){
            return false;
        }
    });

    Images.allow({
        insert: function(){
            return true;
        },
        update: function(){
            return true;
        },
        remove: function(){
            return true;
        },
        download: function(){
            return true;
        }
    });
}
