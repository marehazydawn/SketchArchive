using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using SketchArchive.Models;

namespace SketchArchive
{
    public class SketchService
    {
        private readonly HttpClient _httpClient;
        public SketchService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<SketchFolder>> GetSketchFoldersAsync()
        {
            // The JSON file is located in wwwroot, so the relative URL is "sketches.json"
            return await _httpClient.GetFromJsonAsync<List<SketchFolder>>("sketches.json");
        }
    }
}
