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
            var photo = Session.get('photo');

            //console.log(imagesURL);
            console.log("Description: " + description);
            console.log("Location: " + location.lat + ", " + location.lng);
            console.log("Inserting report...");

            var report = Reports.insert({
                description: description,
                location: location,
                created_at: new Date
            });

            console.log('Inserting image...');

            Images.insert(photo, function (err, photoObj) {
                if (err){
                    // handle error
                    console.log("Error: " + err);
                } else {
                    // handle success depending what you need to do
                    var imagesURL = {
                        "report.image": "/cfs/files/images/" + photoObj._id
                    };
                    Reports.update(report._id, {$set: imagesURL});
                }

            });

        }
    });

    Template.takePhoto.helpers({
        'photo': function () {
            return Session.get('photo');
        },
        'location': function () {
            return Session.get('location');
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    Reports = new Mongo.Collection("reports");

    var imageStore = new FS.Store.GridFS("images");

    Images = new FS.Collection("images", {
        stores: [imageStore]
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

    Reports.deny({
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

    Reports.allow({
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
