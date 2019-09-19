module.exports = app => {
    let Role = app.models.Role;
    let RoleMapping = app.models.RoleMapping;
    let Admin = app.models.Admin;
  
    Role.findOne(
        {
          where: {
            name: "ADMIN"
          }
        },
        (err, role) => {
          if (err) debug(err);
          if (!role) {
            Role.create(
              {
                name: "ADMIN"
              },
              (err, role) => {
                if (err) {
                } else {
                  Admin.find({}, (err, users) => {
                    for (var u in users) {
                      role.principals.create(
                        {
                          principalType: RoleMapping.USER,
                          principalId: users[u].id
                        },
                        function(err, principal) {
                          if (err) {
                            console.log("ERROR CREATING ROLES", err)
                          } else {
                              console.log("SUCCESS", principal)
                          }
                        }
                      );
                    }
                  });
                }
              }
            );
          }
        }
    );
};