d3.json("../data/colombia.json", suHijo => suMadre(suHijo.Colombia) )
// d3.csv("../data/movies.csv", d => console.log(d) )
const width = 700
const height = 500

function suMadre(data){
	const newData = cleanData(data).filter( v => v.followers > 1000).sort(compare)//.filter( d => d != null )

	const stats = mmm(newData)
	const l = newData.length
	const colores = ["#A7C8F2", "#E84FA1", "#027368", "#048ABF", "#F25116", "#BD2D34", "#3D0F11"]

	const xScale = d3.scaleBand().domain(newData.map( d => d.name) ).range([0,width])
	// const yScale = d3.scaleLinear().domain([stats.min,stats.mean, stats.max]).range([height-30,height/2,10])
	const yScale = d3.scaleLog().base(2).domain([stats.min+1,stats.mean, stats.max]).range([height-100, height/2, 10]).nice()
	const xAxis = d3.axisBottom().scale(xScale).tickSize(height-20)
	const yAxis = d3.axisRight().scale(yScale).tickSize(width+20).ticks(19)
	const heightScale = d3.scaleLog().base(2).domain([stats.min+1,stats.mean, stats.max]).range([10,height/2,height-30])
	// const heightScale = d3.scaleLinear().domain([stats.min+1,stats.mean, stats.max]).range([10,height/2,height-30])
	d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis)
	d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis)
	const fillScale = d3.scaleOrdinal().domain([0,l-1]).range(colores)
	// console.log(newData.map( d=> d.name))
	d3.select("svg").selectAll("rect")
		.data(newData, d => d.followers)
		.enter().append("rect")
		.attr('class', 'bar' )
		.attr("width", 97)
		.attr("height", p =>(height-30)- yScale(p.followers +1))
		.attr("x", (p,i) => xScale(p.name)  )//
		.attr("y", d =>  yScale(d.followers))
		.style("stroke", 'black')
		.style("fill", (d,i) => fillScale(i))
}
function compare(a, b){
	if (a.followers < b.followers) return -1
	if (a.followers > b.followers) return 1
	return 0
}
function Artists(name, followers){
	return {
		name,		
		followers
	}
}
function cleanData(data){
	const testArray = data.split(", ")
	const holder = []; 
	let newData= []
	const filtros = (data, fil) => data.filter( v => v.followers > fil) 
	const filA = 30
	testArray.map( (v,i) => {
		holder.push(Artists(v, elRegex(v)) )
	})
	// clean the data
	const dataKeys = []
	holder.map( (v,i) => {
		const tempObj = {}
		const v1 = v.followers.length
		const v2 = v.followers[v1-1]
		const step1 = v2.replace(/\,|\s/, "")
		// tempObj[v.name] = +step1
		// newData.push(tempObj)
		newData.push(Artists(v.name,+step1) )
	})
	return newData
}
function mmm(data){
	const min 		 = d3.min(data, d => d.followers);		      
	const mean 		 = d3.mean(data, d => d.followers);  
	const max 		 = d3.max(data, d => d.followers);     
	const maxI 		 = d3.extent(data, d => d.followers)
	
	return { min, max, mean, maxI }
}
function elRegex(data,index){
	const step1 = /[a-zA-Z]/g
	const step2 = data.replace(step1, '')
	const step3 = step2.replace(/[.*+\-?^${}():_[/]|[\]\\]/g, "")
	const step4 = step3.replace(/\s+[0-9]+\s/g, "")
	const step5 = step4.replace(/\s+[^a-zA-Z0-9]+\s/g, "")
	const step6 = step5.split(" ")
	return step6
}