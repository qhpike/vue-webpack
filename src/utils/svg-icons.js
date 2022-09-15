const req = require.context('@/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

const svgIcons = requireAll(req).map(i => {
    console.log(i.match(re)[1], 'xuexi')
    return i.match(re)[1]
})

export default svgIcons
