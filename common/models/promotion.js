'use strict';

module.exports = function(Promotion) {

    Promotion.findByLocation = function (lat, lng, tagName, options, cb) {
        Promotion.getDataSource().connector.connect(function(err, db) {
            var collection = db.collection('Branch');
            collection.aggregate(
              [
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [ lng , lat ] },
                        key: "location",
                        distanceField: "distance",
                    //  query: { "category": "Something" }
                    }
                },
                {
                    $lookup:
                       {
                         from: "Promotion",
                         let: { branchId: "$_id", distance: "$distance"},
                         pipeline: [
                            { $match:
                               { $expr:
                                  { $and:
                                     [
                                       { $eq: [ "$branchId",  "$$branchId" ] },
                                       { $eq: [ "$active",  true ] },
                                       { $gte: [ "$expirationDate", new Date() ] }
                                     ]
                                  }
                               }
                            },
                            {
                                $addFields: {
                                  distance: "$$distance"
                                }
                            }
                         ],
                         as: "promotions"
                       }
                  },
                  { $unwind: "$promotions"},
                  { $replaceRoot: { newRoot: "$promotions" } },
                  {
                    $lookup:
                      {
                        from: "Restaurant",
                        localField: "restaurantId",
                        foreignField: "_id",
                        as: "restaurant"
                      }
                 },
                 { $unwind: "$restaurant"},
                 {
                    $lookup:
                      {
                        from: "Branch",
                        localField: "branchId",
                        foreignField: "_id",
                        as: "branch"
                      }
                 },
                 { $unwind: "$branch"}
              ]).toArray(function(err,promotions){
                  if(err) return cb(err);
                  else return cb(null,promotions);
                });
           });
    };

};
