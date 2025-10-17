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
      if (!nome || !email || !senha) {
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
        email: newUser.email,
        telefone: newUser.telefone,
        endereco: newUser.endereco,
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
}

module.exports = AuthController;