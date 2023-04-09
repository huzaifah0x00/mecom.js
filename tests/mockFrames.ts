/** Mock frames for testing purposes.
 * OUT: frame sent to device
 * IN: frame received from device
 **/
export const mockFrames = [
  { OUT: "#0115AA?IF257D", IN: "!0115AA8065-TEC SW G01     342D" },
  { OUT: "#0115AB?VR006401FB61", IN: "!0115AB000004620EDF" },
  { OUT: "#0115AC?VR006501A314", IN: "!0115AC000000821A33" },
  { OUT: "#0115AD?VR006601E6BE", IN: "!0115AD00000018B04A" },
  { OUT: "#0115AE?VR006701BECB", IN: "!0115AE00000097232F" },
  { OUT: "#0115AF?VR0068012335", IN: "!0115AF00000002E456" },
  { OUT: "#0115B0?VR006901C0C1", IN: "!0115B0000000008488" },
  { OUT: "#0115B1?VR006A01DE2D", IN: "!0115B1000000006FAB" },
  { OUT: "#0115B2?VR006B0136B2", IN: "!0115B20000000042EF" },
  { OUT: "#0115B3?VR006C016EC7", IN: "!0115B300000000A9CC" },
  { OUT: "#0115B4?VR006D01F7AD", IN: "!0115B4000000001867" },
  { OUT: "#0115B5?VR03E80102FA", IN: "!0115B5419FFF60794B" },
  { OUT: "#0115B6?VR03E9018405", IN: "!0115B641C1DBC02BC7" },
  { OUT: "#0115B7?VR03F201806D", IN: "!0115B741A000008213" },
  { OUT: "#0115B8?VR03F301E1EC", IN: "!0115B841A000001A47" },
  { OUT: "#0115B9?VR03F4010B39", IN: "!0115B9BF12F0A1133C" },
  { OUT: "#0115BA?VR03FC01C36B", IN: "!0115BABF103DDAAE01" },
  { OUT: "#0115BB?VR03FD01F734", IN: "!0115BBBF5C3950B937" },
  { OUT: "#0115BC?VR0406012C21", IN: "!0115BCC29B6A3BC84D" },
  { OUT: "#0115BD?VR04070107EB", IN: "!0115BD431F37329AAD" },
  { OUT: "#0115BE?VR040801449F", IN: "!0115BEBEEC56A41A33" },
  { OUT: "#0115BF?VR0410012A45", IN: "!0115BF0058D6AA5B0D" },
  { OUT: "#0115C0?VR0411016902", IN: "!0115C000000B6CB9F7" },
  { OUT: "#0115C1?VR0412015F17", IN: "!0115C1464333A4FFB5" },
  { OUT: "#0115C2?VR041301D9E8", IN: "!0115C24621C43EDCFB" },
  { OUT: "#0115C3?VR041A0100C5", IN: "!0115C3000000970CF6" },
  { OUT: "#0115C4?VR041B01456F", IN: "!0115C4000000E4C00A" },
  { OUT: "#0115C5?VR041C011D1A", IN: "!0115C50000008235EA" },
  { OUT: "#0115C6?VR041D012945", IN: "!0115C600000018037C" },
  { OUT: "#0115C7?VR04240105D4", IN: "!0115C741C0C60E232D" },
  { OUT: "#0115C8?VR0425016455", IN: "!0115C8412095FF5A57" },
  { OUT: "#0115C9?VR0426015240", IN: "!0115C94051950B897E" },
  { OUT: "#0115CA?VR042701F0BA", IN: "!0115CA42142000E575" },
  { OUT: "#0115CB?VR042E01F71D", IN: "!0115CB000000008671" },
  { OUT: "#0115CC?VR042F01C108", IN: "!0115CC000000006D52" },
  { OUT: "#0115CD?VR043001C1EE", IN: "!0115CD00000000DCF9" },
  { OUT: "#0115CE?VR04420191E6", IN: "!0115CEBF317A7E4035" },
  { OUT: "#0115CF?VR043801B6C5", IN: "!0115CF000000023ADC" },
  { OUT: "#0115D0?VR044C014A92", IN: "!0115D000000000F737" },
  { OUT: "#0115D1?VR044D01A047", IN: "!0115D1000000001C14" },
  { OUT: "#0115D2?VR044E0126B8", IN: "!0115D2000000003150" },
  { OUT: "#0115D3?VR044F0110AD", IN: "!0115D300000000DA73" },
  { OUT: "#0115D4?VR042701C4F6", IN: "!0115D4421420002598" },
  { OUT: "#0115D5?VR04B0016C56", IN: "!0115D500000002A0B9" },
  { OUT: "#0115D6?VR07D00114D2", IN: "!0115D6000000028DFD" },
  { OUT: "#0115D7?VR07DA0194AF", IN: "!0115D70000000156BD" },
  { OUT: "#0115D8?VR07E4018752", IN: "!0115D83F8000003EBB" },
  { OUT: "#0115D9?VR07E501DF27", IN: "!0115D94120000009A7" },
  { OUT: "#0115DA?VR07EE0192E5", IN: "!0115DA412000008B83" },
  { OUT: "#0115DB?VR07EF017A7A", IN: "!0115DB419800006748" },
  { OUT: "#0115DC?VR07F001E44B", IN: "!0115DC41400001D024" },
  { OUT: "#0115DD?VR07F101CF81", IN: "!0115DD41B666673B2E" },
  { OUT: "#0115DE?VR07F8013E55", IN: "!0115DE000000002B20" },
  { OUT: "#0115DF?VR0803017F7E", IN: "!0115DF000000011645" },
  { OUT: "#0115E0?VR0802013C39", IN: "!0115E00000E1005172" },
  { OUT: "#0115E1?VR080401E1DC", IN: "!0115E1000000007351" },
  { OUT: "#0115E2?VR0BB801D147", IN: "!0115E241A00000E925" },
  { OUT: "#0115E3?VR0BBB01A1CB", IN: "!0115E33DB89F60C76C" },
  { OUT: "#0115E4?VR0BBA01E461", IN: "!0115E441117C6026B3" },
  { OUT: "#0115E5?VR0BC2017CC8", IN: "!0115E54249A344CF3C" },
  { OUT: "#0115E6?VR0BC301FA37", IN: "!0115E641C9BB895703" },
  { OUT: "#0115E7?VR0BC40110E2", IN: "!0115E740C1A9CA9E75" },
  { OUT: "#0115E8?VR0BCC011BCB", IN: "!0115E800000000B18D" },
  { OUT: "#0115E9?VR0BD601165B", IN: "!0115E94170000025E3" },
  { OUT: "#0115EA?VR0BD701B4A1", IN: "!0115EA41766666351B" },
  { OUT: "#0115EB?VR0BD801295F", IN: "!0115EB4302000066A2" },
  { OUT: "#0115EC?VR0BD901712A", IN: "!0115EC428800007E0C" },
  { OUT: "#0115ED?VR0BDA011C79", IN: "!0115ED00000001BF67" },
  { OUT: "#0115EE?VR0BE001EAB0", IN: "!0115EE3FD33333A307" },
  { OUT: "#0115EF?VR0BE1016C4F", IN: "!0115EF41200000556D" },
  { OUT: "#0115F0?VR0FA101FB7C", IN: "!0115F00000000029BD" },
  { OUT: "#0115F1?VR0FA201CD69", IN: "!0115F13F80000022ED" },
  { OUT: "#0115F2?VR0FAA01FDFE", IN: "!0115F2415000001BD7" },
  { OUT: "#0115F3?VR0FAB01CBEB", IN: "!0115F34282000022B6" },
  { OUT: "#0115F4?VR0FAC01E021", IN: "!0115F440A00000BA03" },
  { OUT: "#0115F5?VR0FB4014920", IN: "!0115F5000000005E71" },
  { OUT: "#0115F6?VR0FB501CFDF", IN: "!0115F646FF14006F77" },
  { OUT: "#0115F7?VR0FB601F9CA", IN: "!0115F741C80000A64B" },
  { OUT: "#0115F8?VR0FB701984B", IN: "!0115F8461C4000D20F" },
  { OUT: "#0115F9?VR0FB801DB3F", IN: "!0115F9427000004CAE" },
  { OUT: "#0115FA?VR0FB90179C5", IN: "!0115FA451B800086E9" },
  { OUT: "#0115FB?VR0FC801898E", IN: "!0115FB3F800000A472" },
  { OUT: "#0115FC?VR0FC901D1FB", IN: "!0115FC41200000936E" },
  { OUT: "#0115FD?VR0FBE0116DC", IN: "!0115FD43061C465F0D" },
  { OUT: "#0115FE?VR0FBF0120C9", IN: "!0115FE468BFA507A84" },
  { OUT: "#0115FF?VR0FC0018D1A", IN: "!0115FF432451CAB58E" },
  { OUT: "#011600?VR0FC10159ED", IN: "!01160041434240CA53" },
  { OUT: "#011601?VR138901B812", IN: "!01160100000000165A" },
  { OUT: "#011602?VR138A017874", IN: "!0116023F800000DB6D" },
  { OUT: "#011603?VR139201E0DD", IN: "!01160340A00000DF6C" },
  { OUT: "#011604?VR139301CB17", IN: "!011604428C0000F00E" },
  { OUT: "#011605?VR13940121C2", IN: "!01160540A0000085E4" },
  { OUT: "#011606?VR139C01CD95", IN: "!01160600000000A7F1" },
  { OUT: "#011607?VR139D012740", IN: "!01160746FF14005090" },
  { OUT: "#011608?VR139E0146C1", IN: "!01160841C80000EADB" },
  { OUT: "#011609?VR139F0170D4", IN: "!011609461C4000EDE8" },
  { OUT: "#01160A?VR13A0014800", IN: "!01160A427000001A4E" },
  { OUT: "#01160B?VR13A101CEFF", IN: "!01160B451B80007F69" },
  { OUT: "#01160C?VR13A601242A", IN: "!01160C000000007BE6" },
  { OUT: "#01160D?VR13A7010FE0", IN: "!01160D41C80000F410" },
  { OUT: "#01160E?VR13B0017EE9", IN: "!01160E4248A51AC8DA" },
  { OUT: "#01160F?VR13B101F816", IN: "!01160F474274841CE1" },
  { OUT: "#011610?VR13B201D531", IN: "!01161043568F3C3F9B" },
  { OUT: "#011611?VR13B3018D44", IN: "!011611C100DAA0E5D3" },
  { OUT: "#011612?VR17700112ED", IN: "!01161200000008D553" },
  { OUT: "#011613?VR1771014A98", IN: "!01161300000001AF59" },
  { OUT: "#011614?VR1772010F32", IN: "!011614468CA0006A4C" },
  { OUT: "#011615?VR1773015747", IN: "!01161500000000E5F0" },
  { OUT: "#011616?VR1774016318", IN: "!0116163F80000028C7" },
  { OUT: "#011617?VR1775013B6D", IN: "!011617000000002397" },
  { OUT: "#011618?VR177A016914", IN: "!01161845AF00001D36" },
  { OUT: "#011619?VR177D01EDA1", IN: "!0116194053333355E2" },
  { OUT: "#01161A?VR177B01CACB", IN: "!01161A00000000D2C4" },
  { OUT: "#01161B?VR177C014C34", IN: "!01161B3F8000001FF3" },
  { OUT: "#01161C?VR178401AA07", IN: "!01161C0000000014A3" },
  { OUT: "#01161D?VR17850181CD", IN: "!01161D00000000A508" },
  { OUT: "#01161E?VR178601B7D8", IN: "!01161E000000004E2B" },
  { OUT: "#01161F?VR1787013127", IN: "!01161F00000000636F" },
  { OUT: "#011620?VR17D401B1F4", IN: "!0116200000000023F3" },
  { OUT: "#011621?VR17D402EED2", IN: "!01162100000000C8D0" },
  { OUT: "#011622?VR17D4034F3C", IN: "!01162200000000E594" },
  { OUT: "#011623?VR17D404509E", IN: "!011623000000000EB7" },
  { OUT: "#011624?VR17D4055C45", IN: "!01162400000000BF1C" },
  { OUT: "#011625?VR17D4060363", IN: "!01162500000000543F" },
  { OUT: "#011626?VR17D407A28D", IN: "!01162600000000797B" },
  { OUT: "#011627?VR17D4083C27", IN: "!011627000000009258" },
  { OUT: "#011628?VR183801F87F", IN: "!011628000000000A0C" },
  { OUT: "#011629?VR18420101D6", IN: "!01162900000000E12F" },
  { OUT: "#01162A?VR184301A32C", IN: "!01162A00000000630B" },
  { OUT: "#01162B?VR1844019773", IN: "!01162B000000004E4F" },
  { OUT: "#01162C?VR184501CF06", IN: "!01162C38D1B7177E83" },
  { OUT: "#01162D?VR1846018AAC", IN: "!01162D0000000014C7" },
  { OUT: "#01162E?VR184C01D611", IN: "!01162E00000000FFE4" },
  { OUT: "#01162F?VR184D01E24E", IN: "!01162F00000000D2A0" },
  { OUT: "#011630?VR184E01A109", IN: "!011630000000004CB6" },
  { OUT: "#011631?VR184F01971C", IN: "!01163138D1B7177C7A" },
  { OUT: "#011632?VR1850013ACF", IN: "!011632000000008AD1" },
  { OUT: "#011633?VR183802EBD1", IN: "!0116330000000061F2" },
  { OUT: "#011634?VR18420261C7", IN: "!01163400000000D059" },
  { OUT: "#011635?VR18430239B2", IN: "!011635000000003B7A" },
  { OUT: "#011636?VR1844020DED", IN: "!01163600000000163E" },
  { OUT: "#011637?VR1845025598", IN: "!01163738D1B71726F2" },
  { OUT: "#011638?VR1846025A79", IN: "!011638000000006549" },
  { OUT: "#011639?VR184C0206C4", IN: "!011639000000008E6A" },
  { OUT: "#01163A?VR184D02169E", IN: "!01163A000000000C4E" },
  { OUT: "#01163B?VR184E029061", IN: "!01163B00000000210A" },
  { OUT: "#01163C?VR184F02A674", IN: "!01163C38D1B71711C6" },
  { OUT: "#01163D?VR185002A692", IN: "!01163D000000007B82" },
  { OUT: "#01163E?VR1856014B14", IN: "!01163E0000000090A1" },
  { OUT: "#01163F?VR189C018611", IN: "!01163F00000000BDE5" },
  { OUT: "#011640?VRC35001EFDB", IN: "!01164000000000504C" },
  { OUT: "#011641?VRC35101B7AE", IN: "!01164100000000BB6F" },
  { OUT: "#011642?VRC352015F31", IN: "!01164200000000962B" },
  { OUT: "#011643?VRC35A01B12C", IN: "!011643000000007D08" },
  { OUT: "#011644?VRC35B01F486", IN: "!01164400000000CCA3" },
  { OUT: "#011645?VRC35C01ACF3", IN: "!0116457FC000004EA0" },
  { OUT: "#011646?VRC738019B5A", IN: "!011646000000000AC4" },
  { OUT: "#011647?VRC73901C32F", IN: "!01164700000000E1E7" },
  { OUT: "#011648?VRC742013442", IN: "!0116480000000079B3" },
  { OUT: "#011649?VRC743016C37", IN: "!011649000000009290" },
  { OUT: "#01164A?VRC744017C6D", IN: "!01164A0000000010B4" },
  { OUT: "#01164B?VRC74501FA92", IN: "!01164B000000003DF0" },
  { OUT: "#01164C?VRC74601CC87", IN: "!01164C00000000D6D3" },
  { OUT: "#01164D?VRC74701E74D", IN: "!01164D000000006778" },
  { OUT: "#01164E?VRC74801A439", IN: "!01164E000000008C5B" },
  { OUT: "#01164F?VRC7490122C6", IN: "!01164F00000000A11F" },
  { OUT: "#011650?VRC74A012718", IN: "!011650000000003F09" },
  { OUT: "#011651?VRC74C01263D", IN: "!01165100000000D42A" },
  { OUT: "#011652?VRC74D011262", IN: "!01165200000000F96E" },
  { OUT: "#011653?VRCB200160A7", IN: "!01165300000000124D" },
  { OUT: "#011654?VRCB21014B6D", IN: "!01165400000000A3E6" },
  { OUT: "#011655?VRCB22017D78", IN: "!0116550000000158E4" },
  { OUT: "#011656?VRCB2301FB87", IN: "!011656FFFFFFFFDB96" },
  { OUT: "#011657?VRCB2A0122AA", IN: "!011657000000008EA2" },
  { OUT: "#011658?VRCB2C011A7B", IN: "!0116580000000016F6" },
  { OUT: "#011659?VRCB8401400D", IN: "!01165900000000FDD5" },
  { OUT: "#01165A?VRCB8501E2F7", IN: "!01165A000000007FF1" },
  { OUT: "#01165B?VRCB86010A68", IN: "!01165B0000000052B5" },
  { OUT: "#01165C?VRCB8701521D", IN: "!01165C00000080303F" },
  { OUT: "#01165D?VRCBE8011925", IN: "!01165D7FC00000611D" },
];