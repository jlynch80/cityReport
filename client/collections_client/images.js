var imageStoreLarge = new FS.Store.S3("imagesLarge");
var imageStoreSmall = new FS.Store.S3("imagesSmall");

Images = new FS.Collection("images", {
    stores: [imageStoreSmall, imageStoreLarge],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});