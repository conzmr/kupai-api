'use strict';

module.exports = function(Admin) {

    /**
     * Assigns ADMIN role after creation
    ***/
    Admin.afterRemote("create", function(ctx, instance, next) {
        let Role = Admin.app.models.Role;
        let RoleMapping = Admin.app.models.RoleMapping;
    
        Role.findOne(
          {
            where: {
              name: "ADMIN"
            }
          },
          function(err, role) {
            if (err) next(err);
            else if(!role) {
              console.log("ADMIN role not found. Role map not done.");
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
