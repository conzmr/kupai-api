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
          name: instance.type
        }
      },
      function(err, role) {
        if (err) next(err);
        else if(!role) {
          console.log(instance.type+" role not found. Role map not done.");
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
                  instance.accessTokens.create((err, accessToken)=>{
                    if(err) next(err);
                    let result = accessToken.toJSON();
                    result.user = instance;
                    ctx.result = result;
                    next();
                  });
                }
            );
          }
        }
      );
    });
};
