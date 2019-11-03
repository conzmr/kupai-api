'use strict';

module.exports = function(Restaurantuser) {
    /**
     * Assigns RESTAURANT_ADMIN role after creation
    ***/
   Restaurantuser.afterRemote("create", function(ctx, instance, next) {
    let Role = Restaurantuser.app.models.Role;
    let RoleMapping = Restaurantuser.app.models.RoleMapping;

    Role.findOne(
      {
        where: {
          name: "RESTAURANT_ADMIN"
        }
      },
      function(err, role) {
        if (err) next(err);
        else if(!role) {
          console.log("RESTAURANT_ADMIN role not found. Role map not done.");
          next();
        }
        else {
          RoleMapping.create(
            {
                principalType: RoleMapping.USER,
                principalId: instance.id,
                roleId: role.id
            },
            function(err, roleMapping) {
                  if (err) next(err);
                  next();
                }
            );
          }
        }
        );
    });
};
