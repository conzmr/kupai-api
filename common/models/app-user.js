'use strict';

module.exports = function(Appuser) {
    /**
     * Assigns APP_USER role after creation
    ***/
   Appuser.afterRemote("create", function(ctx, instance, next) {
    let Role = Appuser.app.models.Role;
    let RoleMapping = Appuser.app.models.RoleMapping;

    Role.findOne(
      {
        where: {
          name: "APP_USER"
        }
      },
      function(err, role) {
        console.log("HOLIS")
        console.log("ROLE FIND ERROR", err)
        console.log("ROLE FIND", role)
        if (err) next(err);

        if (role) {
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
