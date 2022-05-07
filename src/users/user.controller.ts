import { Controller, Get, Post, HttpCode, Param, Request, Query, Body, Header, Res } from '@nestjs/common';
import { UserProfilesService } from './user.profile.service';

@Controller()
export class UserController {

  constructor(
    private readonly profilesService: UserProfilesService,
  ) {}


  @Post('/authenticate')
  @HttpCode(200)
  // @Header('Token', 'demo@gather.ai')
  authenticateWithCredentials(@Body() params, @Res() res) {
    //PAYLOAD:
    /*
    return {
        Method: 'LOCAL',
        MethodIdentity: "gather.bek@icloud.com",
        TeamName: "Ben E Keith",
        MethodPasscode: "P@ss1234",
        DeviceKey: "MyPC",
        ApplicationKey: "MyBrowser",
        Platform: "Desktop"
    };
    */
    let response = null;
    const headers = {};
    const clients = ['saladinos', 'gather ai'];
    if (params.MethodIdentity === "demo@gather.ai" && params.MethodPasscode === "Demopassword@Gather23" && clients.indexOf(params.TeamName.toLowerCase()) > -1) {
      response = {
        "profileId": 2,
        "firstName": "Gather",
        "lastName": "Demo",
        "email": "demo@gather.ai",
        "mobile": null,
        "memberType": "Manager",
        "capabilities": [],
        "teamId": 1,
        "teamName": "Gather AI",
        "wareHouseId": 1,
        "connectionString": "",
        "additionalData": null
      };
      
      headers['Token'] = params.MethodIdentity;
      res.header(headers);
    }

    return res.json({
      "timeStamp": new Date(),
      "responseCode": response ? "Success" : "Error",
      "validationErrorsList": [],
      "response": response,
      "headers": headers
    });
  }

  @Get('/teams/users')
  @HttpCode(200)
  getAllUsers(): any {
    return this.profilesService.getUsers();
  }
}
