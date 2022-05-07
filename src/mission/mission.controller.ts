import { Controller, Get, Post, Param, Query, UploadedFile } from '@nestjs/common';
import { MissionService } from './mission.service';
import { ApiParam, ApiProperty, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { json } from 'express';

@Controller('missions')
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly reportService: ReportService
    // private readonly iis: InventoryItemService
  ) {}

  @Post(':missionid/ftp')
  uploadFtp() {
    return { };
  }

  @Post('json')
  uploadJson(payload) {
    return payload;
  }

  @Post('/v2/missions/json')
  uploadJsonV2(payload) {
    return payload;
  }

  @Post(':missionId/delete')
  async deleteMission(@Param('missionId') missionId) {
    return await this.missionService.deleteMission(missionId);
  }

  @Post(':clientRef/:invItemCode/image')
  uploadImage(clientRef, invItemCode) {
    // TODO: Process image
    return {clientRef, invItemCode};
  }

  // Naked route w/ query params
  @Get()
  async getAllMissions(@Query() query): Promise<any>{
    // return this.missionService.getAll();
    // return missionData;
    return await this.missionService.getAll(query);
  }

  @Get('inventory')
  async getMissionInventory(@Query() query): Promise<any> {
    // http://localhost:3000/missions?pagesize=9&pagenumber=1&period=lastdays&days=3&sortby=time&sortdirection=asc
    // return await missionInventoryData;
    // return await this.iis.getAll(params);
    return await this.missionService.getMissionInventory(query);
  }

  // Get image for mapview by missionId & binId
  @Get(':missionId/bins/:binId/images')
  async getImagesByMissionBinId(@Param('missionId') missionId, @Param('binId') binId): Promise<any> {
    // console.log('getImagesByMissionBinId: ', missionId, binId);
    return await this.missionService.getImagesByMissionBinId(missionId, binId);
  }

  // CSV Report
  @Get('/:missionId/csv')
  async getMissionCSV(@Param('missionId') missionId): Promise<any> {
    return await this.missionService.downloadCSV(missionId);
  }



  // Get full report
  @Get(':directory')
  @ApiOkResponse({type: json})
  @ApiParam({
    name: 'directory',
    type: String
  })
  async getMissionReportByDirectory(@Param('directory') directory, @Param() params) {
    return await this.reportService.getMissionReportByDirectory(directory, params);
  }

  // Get items
  @Get(':directory/items')
  @ApiOkResponse({type: json})
  @ApiParam({
    name: 'directory',
    type: String
  })
  async getItemsFromMissionReport(@Param('directory') directory, @Param() params) {
    return await this.reportService.getItemsFromMissionReport(directory, params);
  }

  // Get specific item
  @Get(':directory/items/:itemId')
  @ApiOkResponse({type: json})
  @ApiParam({
    name: 'directory',
    type: String
  })
  @ApiParam({
    name: 'itemId',
    type: Number
  })
  async getItemFromMissionReportByItemId(@Param('directory') directory, @Param('itemId') itemId) {
    return await this.reportService.getItemFromMissionReportByItemId(directory, itemId);
  }

  // Replace MissionReport by directory
  // Expects full json
  @Post(':directory/json')
  @ApiOkResponse({type: json})
  @ApiParam({
    name: 'mission_report.json',
    type: Object
  })
  async uploadMissionReportByDirectory(@Param('directory') directory, @UploadedFile('report') file) {
    // return await this.reportService.insertOrUpdate(directory, file)

  }

  // Replace items in mission report by directory
  @Post(':directory/items')
  @ApiOkResponse({type: json})
  @ApiParam({
    name: 'directory',
    type: String
  })
  async uploadMissionReportItemsByDirectory(@Param('directory') directory, @UploadedFile('report') file) {
    // return await this.reportService.insertOrUpdateItems(directory, file)
  }

  // Replace specific item in mission report, by itemid
  @Post(':directory/items/:itemId')
  @ApiOkResponse({type: json})
  @ApiParam({
    name: 'directory',
    type: String
  })
   @ApiParam({
    name: 'itemId.json',
    type: Number
  })
  async uploadMissionreportItemByItemId(@Param('directory') directory, @Param('itemId') itemId, @UploadedFile('report') file) {
    // return await this.reportService.insertOrUpdateItemByItemId(directory, file)
  }





}
