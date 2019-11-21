'use strict';

module.exports = function(Usercoupon) {
                                                                                                                                                                                                                                                                                  
        //LUEGO AHÍ HAGO LO DE SACAR EL CUPÓN MÁS CERCA 
    Usercoupon.getDailyCoupon = async function (lat, lng, options) {
        const moment = require("moment");
        const token = options && options.accessToken;
        const userId = token && token.userId;
        const connector = Usercoupon.getDataSource().connector;
        const collection = connector.collection("Branch");

        try {

            let todaysCoupon = await Usercoupon.findOne({
                where: {
                    createdAt: {
                        gte: moment().startOf('day').toDate(),
                        lte: moment().endOf('day').toDate()
                    }
                }
            });

            if(todaysCoupon){
                return todaysCoupon;
            }

            let userCoupons = await Usercoupon.find({
                userId: userId
            });

            let couponIds  = [];

            userCoupons.forEach(coupon => {
                couponIds.push(coupon.id);
            });

            let coupons = await collection.aggregate(
                [
                  {
                      $geoNear: {
                          near: { type: "Point", coordinates: [ lng , lat ] },
                          key: "location",
                          distanceField: "distance"
                      }
                  },
                  {
                      $lookup:
                         {
                           from: "Coupon",
                           let: { branchId: "$_id", distance: "$distance"},
                           pipeline: [
                              { $match:
                                 { $expr:
                                    { $and:
                                       [
                                        //{ couponId: {'$nin': userCoupons}},
                                        //   couponId not in array I alreeady had
                                         { $eq: [ "$branchId",  "$$branchId" ] },
                                         { $eq: [ "$active",  true ] },
                                         { $gte: [ "$expirationDate", new Date() ] },
                                         { $gt: [ "$available", 0 ] }
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
                           as: "coupons"
                         }
                    },
                    { $unwind: "$coupons"},
                    { $replaceRoot: { newRoot: "$coupons" } },
                    { $limit: 1 }
                ]).toArray();

                var coupon = coupons.pop();

                // var newCoupon = await Usercoupon.create({
                //     branchId: coupon.branchId,
                //     restaurantId: coupon.restaurantId,
                //     couponId: coupon._id, 
                //     userId: userId,
                //     code: Math.random().toString(36).slice(4).toUpperCase()
                // });
                //return newCoupon;
                
                console.log("COUPON  DS", coupon)
                return ({
                  branchId: coupon.branchId,
                  restaurantId: coupon.restaurantId,
                  couponId: coupon._id, 
                  userId: userId,
                  code: Math.random().toString(36).slice(5).toUpperCase()
              })
            
        } catch (error) {
            throw (error);
        }

    };

};
