import { getRepository } from 'typeorm'
import NodeCache from 'node-cache'

import { config } from '@things-factory/env'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'

import { Product } from './entities/product'

export async function initCache() {
  const productRepo = getRepository(Product)
  const [ products, prodsTotal ] = await productRepo.findAndCount()

  var prodsObj = {}
  products.forEach(p => {
    prodsObj[p.code] = p
  })

  const domainRepo = getRepository(Domain)
  const [ domains, domainsTotal ] = await domainRepo.findAndCount()
  var domainsObj = {}
  domains.forEach(d => {
    domainsObj[d['name']] = d
  })

  const userRepo = getRepository(User)
  const [ users, usersTotal ] = await userRepo.findAndCount()
  var usersObj = {}
  users.forEach(u => {
    usersObj[u['email']] = u
  })

  const _cache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
  _cache.mset([
    { key: 'PRODUCT', val: prodsObj }, 
    { key: 'DOMAIN', val: domainsObj },
    { key: 'USER', val: usersObj }
  ])

  config._CACHE = _cache
}