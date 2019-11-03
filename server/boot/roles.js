module.exports = app => {
    let Role = app.models.Role;
    let RoleMapping = app.models.RoleMapping;
    let Admin = app.models.Admin;
    let RestaurantUser = app.models.RestaurantUser;
    let AppUser = app.models.AppUser;
  
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
                            console.log("ERROR CREATING ADMIN ROLES", err)
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

    Role.findOne(
        {
          where: {
            name: "RESTAURANT_ADMIN"
          }
        },
        (err, role) => {
          if (err) debug(err);
          if (!role) {
            Role.create(
              {
                name: "RESTAURANT_ADMIN"
              },
              (err, role) => {
                if (err) {
                } else {
                  RestaurantUser.find({}, (err, users) => {
                    for (var u in users) {
                      role.principals.create(
                        {
                          principalType: RoleMapping.USER,
                          principalId: users[u].id
                        },
                        function(err, principal) {
                          if (err) {
                            console.log("ERROR CREATING RESTAURANT ADMIN ROLES", err)
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

    Role.findOne(
      {
        where: { 
          name: "APP_USER"
        }
      },
      (err, role) => {
        if (err) debug(err);
        if (!role) {
          Role.create(
            {
              name: "APP_USER"
            },
            (err, role) => {
              if (err) {
              } else {
                AppUser.find({}, (err, users) => {
                  for (var u in users) {
                    role.principals.create(
                      {
                        principalType: RoleMapping.USER,
                        principalId: users[u].id
                      },
                      function(err, principal) {
                        if (err) {
                          console.log("ERROR CREATING RESTAURANT APP_USER ROLES", err)
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