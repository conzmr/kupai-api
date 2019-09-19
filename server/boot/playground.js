module.exports = app => {
    console.log("-------------------------------------");
    console.log("RUNNING ON ENVIRONMENT:", process.env.NODE_ENV);
    console.log("-------------------------------------");
    let Admin = app.models.Admin;

    // Admin.create({
    //     email: "madrigalreyes.c@gmail.com",
    //     password: "Madrigal1821*"
    // }, (err, res) => {
    //     console.log("ERR ADMIN", err)
    //     console.log("SUCCESS ADMIN", res)
    // })
};