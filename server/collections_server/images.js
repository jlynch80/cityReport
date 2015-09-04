var imageStoreLarge = new FS.Store.S3("imagesLarge", {
    accessKeyId: "AKIAJGBQSAO4VZ3OPSTQ",
    secretAccessKey: "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",
    bucket: "images.large",
    transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
    }
});

var imageStoreSmall = new FS.Store.S3("imagesSmall", {
    accessKeyId: "AKIAJGBQSAO4VZ3OPSTQ",
    secretAccessKey: "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",
    bucket: "images.small",
    beforeWrite: function(fileObj) {
        fileObj.size(20, {store: "imageStoreSmall", save: false});
    },
    transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('20', '20').stream().pipe(writeStream)
    }
});


Images = new FS.Collection("images", {
    stores: [imageStoreSmall, imageStoreLarge],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});