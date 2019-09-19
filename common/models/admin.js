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
    
            if (role) {
              RoleMapping.create(
                {
                    principalType: RoleMapping.USER,
                    principalId: instance.id,
                    roleId: role.id
                },
                function(err, roleMapping) {
                    console.log("HOOK ADMIN err", err)
                    console.log("HOOK ADMIN roleMapping", roleMapping)
                  if (err) next(err);
                  next();
                }
              );
            }
          }
        );
    });

};
