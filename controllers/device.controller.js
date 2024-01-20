const deviceService = require('../services/device.service');
const userService = require('../services/user.service');

const addDevice = async (req, res, next) => {
    if (!req.isAuthenticated()){
        res.status(500).json({ errorMessage: "BLABLABAL" });
        return;
    }

    const device_id = req.body.device_id;
    const secret_key = req.body.secret_key;
    console.log(secret_key);

    if (!(await deviceService.areDeviceCredentialsValid(device_id, secret_key))) {
        res.status(404).json({ errorMessage: "Invalid Credentials" });
        return;
    } else if (userService.isDeviceAllreadyLinked(device_id, req.user)){
        res.status(404).json({ errorMessage: "Device allready linked" });
        return;
    } else {
        await userService.linkNewDevice(req.user, device_id);
        res.status(200).json({ successMessage: "Linked Successfully", device_id: device_id });
        return;
    }
};

module.exports = {
    addDevice
};
