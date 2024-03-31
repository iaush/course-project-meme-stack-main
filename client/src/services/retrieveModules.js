import axios from 'axios';
const axiosApiClient = axios.create();

const nusModsUrl = 'https://api.nusmods.com/v2/';

export async function retrieveModules(acadYear) {
  // fetch moduleList from nus mods api
  // modules list contains module title, moduleCode and semesters
  // in following format:
  // e.g. {moduleCode: 'AB5001', 'semesters': [2], title: 'Software Development'}
  // format academic year into nus mods required acad year format, e.g. '2018-2019'
  const nusModsModuleListUrl = nusModsUrl + acadYear + '/moduleList.json';

  try {
    const response = await axiosApiClient({
      method: 'get',
      url: nusModsModuleListUrl,
    });

    if (response?.data) {
      return response.data;
    }
  } catch (e) {
    const error =
      'There was an error retrieving module list, please try again later.';
    return error;
  }
}

export async function retrieveModuleData(acadYear, courseCode) {
  // fetch module information from nus mods api given module courseCode
  const nusModsModuleInfoUrl =
    nusModsUrl + acadYear + '/modules/' + courseCode + '.json';

  try {
    const response = await axiosApiClient({
      method: 'get',
      url: nusModsModuleInfoUrl,
    });

    if (response?.data) {
      return response.data;
    }
  } catch (e) {
    const error =
      'There was an error retrieving module data, please try again later.';
    return error;
  }
}
