class Election {
  constructor(data) {
    this.year = data.year
    this.name = data.name.replace(/\s/g, '-').toLowerCase()
    switch(data.name) {
      case '2016 Legislator Election':
        this.title = '2016 立法委員選舉'
        break;
      case '2016 President Election':
        this.title = '2016 總統選舉'
        break;
      case '2014 Council Election':
        this.title = '2014 縣市議員選舉'
        break;
      case '2018 Council Election':
        this.title = '2018 縣市議員選舉'
        break;
      case '2014 Mayor Election':
        this.title = '2014 縣市長選舉'
        break;
      case '2018 Mayor Election':
        this.title = '2018 縣市長選舉'
        break;
      case '2018 Townshipmayor Election':
        this.title = '2018 鄉鎮市長選舉'
        break;
      case '2018 Villagechief Election':
        this.title = '2018 村里長選舉'
        break;
      case '2018 Townshiprepresentative Election':
        this.title = '2018 鄉鎮市民代表選舉'
        break;
      default:
        data.title = data.name
    }
    this.regions = data.regions.map((region) => {
      let firstConstituency = '第01選區'
      if(['全國', '山地立委', '平地立委'].includes(region.name)) {
        firstConstituency = '全國'
      } else if(['2018 Mayor Election',
                 '2014 Mayor Election'].includes(data.name)) {
        firstConstituency = region.name
      } else if(['2018 Villagechief Election', '2018 Townshipmayor Election'].includes(data.name)) {
        firstConstituency = region.constituencies[0].name
      }
      return({
        name: region.name,
        firstConstituency: firstConstituency
      })
    })
  }
}

export default Election
