module.exports = app => {
    let Role = app.models.Role;
    let RoleMapping = app.models.RoleMapping;
    let AppUser = app.models.AppUser;
  
    Role.findOne(
        {
          where: {
            name: "ADMIN"
          }
        },
        (err, role) => {
          if (err) console.log(err);
          if (!role) {
            Role.create(
              {
                name: "ADMIN"
              },
              (err, role) => {
                if (err) {
                } else {
                  AppUser.find({
                    type: "ADMIN"
                  }, (err, users) => {
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
          if (err) console.log(err);
          if (!role) {
            Role.create(
              {
                name: "RESTAURANT_ADMIN"
              },
              (err, role) => {
                if (err) {
                } else {
                  AppUser.find({
                    type: "RESTAURANT_ADMIN"
                  }, (err, users) => {
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
        if (err) console.log(err);
        if (!role) {
          Role.create(
            {
              name: "APP_USER"
            },
            (err, role) => {
              if (err) {
              } else {
                AppUser.find({
                  type: "APP_USER"
                }, (err, users) => {
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