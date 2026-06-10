const { getCampaigns, getCampaignById, createCampaign, getPromoCodeByCode, createPromoCode, incrementPromoCodeUses } = require('../models/campaignModel');

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await getCampaigns();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const getCampaign = async (req, res) => {
  try {
    const campaign = await getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Kampanja nije pronadjena' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const addCampaign = async (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body;
    if (!name || !start_date || !end_date) {
      return res.status(400).json({ message: 'Naziv, datum pocetka i zavrsetka su obavezni' });
    }
    const campaign = await createCampaign(name, description, start_date, end_date);
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const validatePromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    const promoCode = await getPromoCodeByCode(code);
    
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo kod nije pronadjen' });
    }
    
    if (promoCode.max_uses && promoCode.current_uses >= promoCode.max_uses) {
      return res.status(400).json({ message: 'Promo kod je iskoriscen' });
    }

    await incrementPromoCodeUses(code);
    res.json({ discount_value: promoCode.discount_value, message: 'Promo kod je validan' });
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const addPromoCode = async (req, res) => {
  try {
    const { campaign_id, code, discount_value, max_uses } = req.body;
    if (!campaign_id || !code || !discount_value) {
      return res.status(400).json({ message: 'campaign_id, code i discount_value su obavezni' });
    }
    const promoCode = await createPromoCode(campaign_id, code, discount_value, max_uses);
    res.status(201).json(promoCode);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

module.exports = { getAllCampaigns, getCampaign, addCampaign, validatePromoCode, addPromoCode };