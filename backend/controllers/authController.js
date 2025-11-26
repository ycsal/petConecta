const User = require('../models/User');

class AuthController {
  static async register(req, res) {
    try {
      const { 
      nome, 
      sobrenome, 
      email, 
      senha, 
      telefone, 
      endereco,
      tipoUsuario 
    } = req.body;

      console.log('Tentativa de registro:', { nome, email });

      // Verificar se usuário já existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ 
          success: false,
          error: 'Já existe um usuário com este email' 
        });
      }

      // Validar campos obrigatórios
      if (!nome || !sobrenome || !email || !senha || !tipoUsuario) {
        return res.status(400).json({
          success: false,
          error: 'Nome, email e senha são obrigatórios'
        });
      }

      // Criar novo usuário (senha sem hash por enquanto)
      const newUser = new User({
        nome,
        sobrenome, // NOVO CAMPO
        email,
        senha,
        telefone,
        endereco,
        tipoUsuario, // NOVO CAMPO
        ultimo_login: new Date()
      });

      await newUser.save();
      
      // Retornar usuário sem senha
      const userResponse = {
        _id: newUser._id,
        nome: newUser.nome,
        sobrenome: newUser.sobrenome, 
        email: newUser.email,
        telefone: newUser.telefone,
        endereco: newUser.endereco,
        tipoUsuario: newUser.tipoUsuario,
        data_cadastro: newUser.data_cadastro
      };
      
      console.log('Usuário registrado com sucesso:', userResponse.email);
      
      res.status(201).json({
        success: true,
        user: userResponse,
        message: 'Usuário criado com sucesso'
      });
    } catch (err) {
      console.error('Erro no registro:', err);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      console.log('Tentativa de login:', email);

      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ 
          success: false,
          error: 'Email ou senha incorretos' 
        });
      }

      // Verificar senha (simples por enquanto)
      if (user.senha !== senha) {
        return res.status(400).json({ 
          success: false,
          error: 'Email ou senha incorretos' 
        });
      }

      // Atualizar último login
      user.ultimo_login = new Date();
      await user.save();

      // Retornar usuário sem senha
      const userResponse = {
        _id: user._id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        endereco: user.endereco,
        data_cadastro: user.data_cadastro,
        ultimo_login: user.ultimo_login
      };

      console.log('Login bem-sucedido:', userResponse.email);
      
      res.json({
        success: true,
        user: userResponse,
        message: 'Login realizado com sucesso'
      });
    } catch (err) {
      console.error('Erro no login:', err);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId).select('-senha');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
  static async updateProfile(req, res) {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    console.log('Atualizando perfil do usuário:', userId);
    console.log('Dados recebidos:', updateData);

    // Remove campos que não devem ser atualizados
    delete updateData._id;
    delete updateData.data_cadastro;
    delete updateData.ultimo_login;

    // Se senha foi enviada vazia, remove do update
    if (updateData.senha === '') {
      delete updateData.senha;
    }

    const user = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-senha');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    console.log('Perfil atualizado com sucesso:', user.email);

    res.json({
      success: true,
      user,
      message: 'Perfil atualizado com sucesso'
    });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Este email já está em uso'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
}

module.exports = AuthController;