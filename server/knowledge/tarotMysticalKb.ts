import type { TarotGuidebookEntry } from '../../src/types/tarot.ts';

export const MYSTICAL_MANGA_PREFACE_VI =
  'Trong Mystical Manga Tarot (Rann & Barbara Moore), 78 lá bài được thiết kế theo chuẩn truyền thống Rider Waite Smith, kết hợp giữa hành trình nguyên mẫu của Bộ Ẩn Chính (22 lá) và những trải nghiệm đời sống thường nhật của Bộ Ẩn Phụ (56 lá: Wands, Cups, Swords, Coins).';

const MAJOR_INTRO_VI =
  'Bộ Ẩn Chính (22 lá): Đại diện cho những bí mật to lớn, cột mốc quan trọng và nguồn năng lượng định hình hành trình linh hồn của bạn.';

const WANDS_INTRO_VI =
  'Bộ Wands (Lửa): Biểu lộ cách mà động lực, ý chí và đam mê bên trong thể hiện ra bên ngoài, phản ánh tình trạng nghề nghiệp và các dự án.';

const CUPS_INTRO_VI =
  'Bộ Cups (Nước): Đại diện cho cảm xúc, những mối quan hệ và thôi thúc sáng tạo — cách chúng ta trải nghiệm cuộc đời qua cảm giác.';

const SWORDS_INTRO_VI =
  'Bộ Swords (Khí): Bộc lộ những ý tưởng về sự thật, lý trí và giao tiếp — cách suy nghĩ của bản thân và đón đầu các thử thách.';

const COINS_INTRO_VI =
  'Bộ Coins / Pentacles (Đất): Thể hiện niềm tin về thế giới vật lý, tài nguyên, sự chăm chỉ trong công việc, vận may và sự hào phóng.';

export const TAROT_MYSTICAL_KB: Record<string, TarotGuidebookEntry> = {
  // ================= MAJOR ARCANA (0 - XXI) =================
  'the-fool': {
    cardId: 'the-fool',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'The Fool là kẻ phiêu lưu, linh hồn mới sẵn sàng hiện thân trên Trái Đất với chiếc túi chứa năng lực bẩm sinh và chú chó trung thành là hiện thân của trực giác kết nối với vũ trụ vật lý.',
    predictiveMeaningVi:
      'Một sự khởi đầu mới, cần phải có lòng dũng cảm và niềm tin, cần phải mạnh dạn bước đi cho dù điều đó là ngốc nghếch.',
    adviceVi:
      'Hãy lắng nghe những bản năng của mình và làm những gì mà bạn muốn cho dù bạn thấy chúng thật đáng sợ. Chẳng có bằng chứng nào cho thấy chúng sẽ thật sự dễ dàng đối với bạn, thế nhưng điều đó sẽ đưa bạn đến nơi cần phải đến và mang lại cho bạn những kinh nghiệm bạn cần phải có.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang thật sự theo bước trực giác không hay chỉ là đang trở nên ngu ngốc? Mình có đang buông bỏ sự sợ hãi để sống một cuộc đời mình mong muốn hay không?',
    sourcePages: 'pp. 2-3',
  },
  'the-magician': {
    cardId: 'the-magician',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Khía cạnh hướng ngoại của The Fool muốn khám phá thế giới, thử nghiệm năng lực tự nhiên và làm chủ bốn nguyên tố Sword (Khí), Wand (Lửa), Cup (Nước), Coins (Đất) để biểu lộ ý chí.',
    predictiveMeaningVi:
      'Sức mạnh, kĩ năng, sự thấu hiểu, khát vọng, năng lực sáng tạo. Điều đang xảy ra có thể sẽ không rõ ràng với người quan sát bình thường. Khi muốn thấy thế giới của những khả năng thì phải quan sát bằng đôi mắt của ma thuật.',
    adviceVi:
      'Bạn có những kĩ năng cần thiết để đạt được mục tiêu của mình. Tự tin, mạnh mẽ lên nào. Hãy sẵn sàng bước ra khỏi vùng an toàn của mình và làm nên điều gì đó hoàn toàn khác biệt. Tình huống này là thời điểm để bạn tạo nên một phép màu.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: tại sao mình lại sợ hãi và không đẩy kĩ năng của mình đi xa hơn chứ? Liệu có thứ gì đó đang níu giữ mình và ép mình phải ở yên trong vùng an toàn không?',
    sourcePages: 'pp. 3-4',
  },
  'the-high-priestess': {
    cardId: 'the-high-priestess',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Khía cạnh hướng nội nhảy múa trong bóng tối huyền bí, chú tâm vào những gì vô hình và vinh danh những cách hiểu biết vượt ngoài lý trí; cô là sự tĩnh tâm cân bằng cho hành động hướng ngoại của The Magician.',
    predictiveMeaningVi:
      'Tình hình này có vẻ không chắc chắn cho lắm vì điều quan trọng đang chìm bên dưới và không cần thiết phải logic cho lắm. Có những bí mật đang ẩn giấu; chỉ có những người hoà nhịp được với vũ trụ sẽ thấy điều gì đang thật sự diễn ra.',
    adviceVi:
      'Đây là thời điểm để hiểu thêm về cuộc sống nội tâm và lắng nghe giọng nói bên trong mình. Tình hình bên ngoài có vẻ không hợp lý lắm, vậy nên bạn phải thật sự tin tưởng bản thân và tìm đến sự thông thái trong nội tâm.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình đang giấu bản thân mình điều gì? Mình đang che giấu những bí mật gì và tại sao? Làm thế nào mình có thể phát triển tiếng nói nội tâm và tin tưởng những lời thì thầm của trái tim?',
    sourcePages: 'pp. 5-6',
  },
  'the-empress': {
    cardId: 'the-empress',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Đại diện cho những lời dạy bảo của gia đình, giá trị nguyên mẫu để nuôi dưỡng mối quan hệ và là Đất Mẹ trù phú ôm trọn cả niềm vui lẫn bi kịch của vòng xoay cuộc đời.',
    predictiveMeaningVi:
      'Sự giàu có và đủ đầy của cuộc đời có mặt ở khắp nơi. Điều này vừa là một lời cầu chúc vừa đòi hỏi trách nhiệm; sự giàu có yêu cầu sự chú ý, nuôi dưỡng và yêu thương nếu bạn muốn nó tiếp tục phát triển.',
    adviceVi:
      'Hãy công nhận các giá trị của bạn và dành thời gian chú ý năng lượng cho chúng. Hãy tập trung vào điều bạn muốn gia tăng trong cuộc đời mình, đồng thời chú ý đến các giới hạn vì không gì phát triển tốt nếu bị nhồi nhét.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang bám víu vào một thái độ nghèo nàn hay không? Mình có cho phép những giới hạn gây hại xuất hiện trong đời sống và các mối quan hệ không? Mình có đang lặp lại thói quen không lành mạnh từ gia đình không?',
    sourcePages: 'pp. 6-7',
  },
  'the-emperor': {
    cardId: 'the-emperor',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Trong khi The Empress cung cấp vật liệu thô, The Emperor lo việc thu hoạch, lưu trữ, phân phối tài nguyên, dạy về trách nhiệm, bổn phận và cách phục vụ điều lớn lao hơn bản thân.',
    predictiveMeaningVi:
      'Lá bài mang quyền lực và tính tổ chức cao. Đây có thể là khoảng thời gian sung túc hoặc đạt được điều mong muốn, nhưng cần có một kế hoạch tốt và cấu trúc dựa trên logic, lý lẽ.',
    adviceVi:
      'Hãy nhận biết nhu cầu và phát triển một kế hoạch nhằm quản lý nó. Hãy quyết định mục tiêu của mình và trước khi hành động hãy hỏi xem điều đó có đưa bạn đến gần mục tiêu hơn không; đừng lãng phí sức lực cho khát vọng tầm thường.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: vì ai và làm sao mà mình lại trao cho họ tự do lẫn quyền lực? Tại sao mình lại gặp vấn đề với hiệu suất? Bằng cách nào mình lại bất đồng với hệ thống giá trị văn hoá này?',
    sourcePages: 'pp. 8-9',
  },
  'the-hierophant': {
    cardId: 'the-hierophant',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Cầu nối vững chắc giữa giá trị bên trong và hành động bên ngoài; người dạy cách đối nhân xử thế và sống trọn vẹn với niềm tin để đạt được sự bình yên nội tâm.',
    predictiveMeaningVi:
      'Huấn luyện hoặc giáo dục mang tính hình thức, nghi thức truyền thống, niềm tin hoặc sự gắn bó với một hệ thống giá trị. Việc dạy bảo, học hỏi và luyện tập là trọng tâm của tình huống này.',
    adviceVi:
      'Hãy quan sát thật kĩ những gì bạn tin tưởng nhất và đảm bảo mọi hành vi của bạn đều phản chiếu chúng. Nếu chưa rõ niềm tin của mình, hãy nhìn vào hành động của chính bạn.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang sống thật hay không? Mình có đang sống cuộc đời của người khác hay không? Mình có đang từ chối, nổi loạn hoặc cân nhắc cẩn thận trái tim và linh hồn của mình không?',
    sourcePages: 'pp. 9-10',
  },
  'the-lovers': {
    cardId: 'the-lovers',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Sau khi thấu hiểu luật lệ và truyền thống, The Fool đối diện thử thách lựa chọn dựa trên khao khát chân thật của trái tim hay cảm nhận thông thường; thiên thần chỉ lối rằng trái tim là ngôi sao dẫn đường chính xác nhất.',
    predictiveMeaningVi:
      'Có thể chỉ ra một tình huống lãng mạn, nhưng sâu xa hơn đây là lá bài của "lựa chọn khó khăn" — nơi không có bảng liệt kê ưu nhược điểm logic rõ ràng.',
    adviceVi:
      'Vì lúc này không có lựa chọn hợp lý rạch ròi nào cả, hãy quyết định điều mà bản thân bạn cảm thấy thích hợp nhất với khao khát của trái tim và linh hồn bạn.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình đang từ chối những khát vọng của bản thân như thế nào? Nếu không phải trái tim mình thì thứ gì đang dẫn dắt lựa chọn này? Điều gì mình thật sự muốn nhưng lại sợ thừa nhận?',
    sourcePages: 'pp. 11-12',
  },
  'the-chariot': {
    cardId: 'the-chariot',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Giống như người trẻ lần đầu cầm lái bước vào thế giới rộng lớn, The Fool pha trộn kì vọng với kinh nghiệm cá nhân để điều khiển cỗ xe của chính mình tiến về phía trước.',
    predictiveMeaningVi:
      'Đã đến lúc kiểm soát bản thân và tiến về phía trước. Chẳng có điều gì xảy ra trừ khi bạn hành động. Tình huống mới có thể gây lo lắng nhưng sự hoàn mỹ lúc này không cần thiết bằng việc bước đi.',
    adviceVi:
      'Bạn có những sợi dây cương, hãy nhặt chúng lên và thắng cỗ thôi. Đừng lo lắng dù kĩ năng chưa được kiểm chứng hết — bạn đã có đủ nội lực rồi, hãy hành động và điều chỉnh khi tiến bước.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang chờ đợi người khác quyết định cho mình không? Mình có nghi ngờ năng lực hoặc lựa chọn của chính mình không? Mình cần chuẩn bị thêm kĩ năng gì trước khi sẵn sàng?',
    sourcePages: 'pp. 12-13',
  },
  'strength': {
    cardId: 'strength',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'The Fool kích động ý chí tự chủ, đối diện với những con quỷ cảm xúc và vết thương tâm linh bên trong; qua sự can đảm nhìn thẳng vào vực sâu, anh nhận được sự tự tin không thể lung lay.',
    predictiveMeaningVi:
      'Có những trận chiến khó khăn phải đối mặt ngay lúc này từ bên ngoài hoặc từ phần bóng tối bên trong bạn. Hoặc nỗi sợ sẽ nhấn chìm bạn, hoặc bạn sẽ tìm thấy sức mạnh tâm trí và linh hồn rực sáng vượt mọi tưởng tượng.',
    adviceVi:
      'Hãy làm công việc lặng thầm của bạn. Tìm kiếm những phần của chính bạn mà bạn đã từ bỏ hoặc cảm thấy không xứng đáng, chữa lành những vết thương đó và lấy lại sự trọn vẹn của chính mình.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: có phải vấn đề về một người khác đang làm phiền mình hay không? Điều đó thoả mãn điều gì bên trong mình? Những điều gì làm mình sợ hãi nhất trong bóng tối?',
    sourcePages: 'pp. 14-15',
  },
  'the-hermit': {
    cardId: 'the-hermit',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Khi nhận ra cuộc đời không chỉ có trắng và đen, The Fool ẩn mình khỏi xã hội để đối chất với trái tim, buông tấm bản đồ cũ và bước đi theo ánh đèn soi từng bước của trí tuệ nội tâm.',
    predictiveMeaningVi:
      'Xã hội, bạn bè hay gia đình có thể đưa ra đủ lời khuyên nhưng chẳng ai có câu trả lời xác thực cho bạn lúc này. Chỉ hành động chân thực từ chính nội tâm bạn mới có giá trị.',
    adviceVi:
      'Khi rút lui khỏi ồn ào bên ngoài, hãy gạt bỏ tạp âm đưa vào — bạn đã có tất cả những gì mình cần. Hãy hỏi bằng trái tim và linh hồn mình, giữ lại điều đúng đắn và loại bỏ điều sai lệch.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang tự phân tán bản thân khỏi những suy nghĩ thử thách thông qua việc xã hội hoá quá mức không? Mình có dựa dẫm quá nhiều vào ý kiến người khác không?',
    sourcePages: 'pp. 15-16',
  },
  'wheel-of-fortune': {
    cardId: 'wheel-of-fortune',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'The Fool nhận ra mình bị cuốn vào vòng xoay lặp lại của thói quen cũ và bài học văn hoá, thôi thúc anh phải thay đổi chiến thuật phản hồi thay vì lặp lại cách cũ.',
    predictiveMeaningVi:
      'Thời gian xoay vòng như các mùa; trong đời luôn có lúc lên voi, lúc xuống chó. Bạn có thể không kiểm soát được điều Bánh Xe mang đến, nhưng hoàn toàn kiểm soát được cách mình phản hồi.',
    adviceVi:
      'Đừng để những bất thường của vận may hay vòng xoay cuộc đời kiểm soát hành vi của bạn. Sức mạnh và tự do nằm trong ý chí của bạn — hãy chọn cách phản hồi khiến bạn tự hào.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình bị vướng ở đâu? Mình đang lặp đi lặp lại những điều gì?',
    sourcePages: 'pp. 17-18',
  },
  'justice': {
    cardId: 'justice',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'The Fool học rằng công lý vũ trụ và luật nhân quả vận hành ở tầng sâu hơn sự công bằng bề mặt: mọi hành động và ý định đều tạo nên hậu quả và định hình tương lai.',
    predictiveMeaningVi:
      'Người ta đang nhận được kết quả tương ứng với hành động và ý định của mình. Ai hành xử đáng kính sẽ hài lòng; ai đi ngược chuẩn mực và giá trị của mình sẽ khó mà an tâm.',
    adviceVi:
      'Nếu bạn đã đối xử tử tế và ngay thẳng, hãy tiếp tục tin tưởng công lý sẽ được thực thi. Nếu chưa, đừng cãi vã đổ lỗi — hãy nhẹ nhàng chấp nhận kết quả và chọn lựa tốt hơn ở lần tới.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang lãng phí sức lực đổ thừa cho sự bất công khi công bằng không phải gốc vấn đề? Mình có đang từ chối công lý với người khác không?',
    sourcePages: 'pp. 18-19',
  },
  'the-hanged-man': {
    cardId: 'the-hanged-man',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Kiên định với sự thật từ tận sâu trong tim dù bị xem là kẻ nổi loạn, The Fool đứng yên giữa thử thách với niềm tin không phụ thuộc vào phán xét xã hội.',
    predictiveMeaningVi:
      'Một khi đã hành động hết sức theo niềm tin của mình, tất cả những gì bạn có thể làm lúc này là ngồi yên và chờ đợi. Bản năng muốn vùng chạy nhưng việc di chuyển vật lý là bất khả thi trong lúc tâm trí đang chiêm nghiệm sâu sắc.',
    adviceVi:
      'Bạn đã làm đúng trong khoảnh khắc đó và không thể quay đầu. Hãy giữ bình thản, thiền định hoặc nguyện cầu để trái tim và tâm trí được dịu êm trong lúc chờ đợi.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: có phải mình đã quay lưng lại với thứ mà lẽ ra không nên? Mình có đang tự biến mình thành kẻ tử vì đạo một cách không cần thiết hay từ bỏ quyền kiểm soát sai lúc không?',
    sourcePages: 'pp. 20-21',
  },
  'death': {
    cardId: 'death',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Sau sự tĩnh lặng của The Hanged Man, phép ẩn dụ ấu trùng hoá bướm trở thành hiện thực: The Fool buông bỏ mọi lớp vỏ nhận diện cũ của gia đình, xã hội và nỗi sợ để lần đầu cảm thấy tự do thật sự.',
    predictiveMeaningVi:
      'Các sự kiện kết nối để tạo nên một sự thay đổi tất yếu, có tổ chức — một kết thúc tự nhiên cho những gì vướng mắc hoặc có hại. Sự mất mát dù dọn đường cho điều tốt đẹp hơn vẫn mang lại nỗi đau cần được nhìn nhận.',
    adviceVi:
      'Thay đổi là cần thiết, đừng cố ngăn cản nó. Hãy thừa nhận nỗi buồn và cho bản thân thời gian tiếc thương đúng mực; nếu trốn tránh bạn chỉ trì hoãn quá trình tái sinh của chính mình.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình đang bị vướng mắc ở đâu và mình cần phải buông bỏ những thứ nào?',
    sourcePages: 'pp. 21-22',
  },
  'temperance': {
    cardId: 'temperance',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Bước ra từ cuộc lột xác của Death, The Fool tổng hợp được những mặt đối lập trong mình thành dòng chảy hài hoà, lắng nghe giọng nói nội tâm rõ ràng và bình thản.',
    predictiveMeaningVi:
      'Khả năng điều phối áp lực mạnh mẽ và hoàn cảnh khó khăn một cách thanh thản. Các lựa chọn, hành động và lời nói được pha trộn theo tỉ lệ hài hoà giữa sự thật, lòng trắc ẩn và sức mạnh.',
    adviceVi:
      'Hãy kết hợp phần sáng suốt nhất của lý trí với trực giác bên trong — bạn sẽ tìm thấy liều thuốc ma thuật của sự bình an dù hoàn cảnh có hỗn loạn đến đâu. Hãy tin vào giọng nói nội tâm.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình đang làm gì để phá hoại bản thân? Tại sao mình lại chống đối sự thanh thản? Mình có đang say mê kịch tính, giận dữ và hỗn loạn hơn vẻ đẹp bình yên không?',
    sourcePages: 'pp. 23',
  },
  'the-devil': {
    cardId: 'the-devil',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Ngay khi mọi thứ vào guồng, thói quen cũ và vết thương xưa trỗi dậy để thử thách xem The Fool đã thật sự đổi thay hay chưa, giúp củng cố quyết tâm cho con người mới.',
    predictiveMeaningVi:
      'Có một thế lực hoặc thói quen đang trói buộc tình hình: những ràng buộc không lành mạnh, thói quen thiếu bổ ích hoặc những mối quan hệ lợi dụng đi ngược lại khát vọng đích thực của linh hồn bạn.',
    adviceVi:
      'Đừng cảm thấy vô vọng. Đúng là bạn đang kẹt trong vòng xoay huỷ diệt, nhưng bạn hoàn toàn có quyền phá vỡ nó. Hãy hành động quyết đoán và đừng ngại tìm sự hỗ trợ từ bên ngoài nếu cần.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: những thói quen và hành vi nào mình đang tự cho phép kiểm soát bản thân? Mình đang nhận được lợi ích ngầm nào từ những thói quen đó?',
    sourcePages: 'pp. 24-25',
  },
  'the-tower': {
    cardId: 'the-tower',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Khi The Fool đứng lên phá bỏ thái độ cũ, cấu trúc giả tạo xung quanh sụp đổ trong hỗn loạn để mở không gian cho một trật tự sống chân thật và tràn đầy sinh lực hơn.',
    predictiveMeaningVi:
      'Một số phần trong cuộc sống đang rạn nứt và rơi rụng. Không phải tất cả sẽ tan biến — chỉ những gì không còn đáp ứng chuẩn mực cao nhất của bạn mới sụp đổ để nhường chỗ cho sự tái thiết tốt đẹp hơn.',
    adviceVi:
      'Đừng tự làm mình đau thêm bằng cách níu kéo đống đổ nát; hãy bước ra khỏi vùng sụp đổ, đợi mọi thứ lắng xuống rồi quay lại nhặt nhạnh những giá trị cốt lõi còn sót lại để tái tạo cuộc đời.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang tự ấn nút "huỷ diệt" trong một lĩnh vực nào đó hay đang tạo ra kịch tính không cần thiết như một cách sao nhãng bản thân không?',
    sourcePages: 'pp. 25-26',
  },
  'the-star': {
    cardId: 'the-star',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Sau cơn bão của The Tower, The Star mang dòng nước mát và hương sen thanh tẩy mệt mỏi, giúp The Fool tìm thấy Ngôi Sao Bắc Đẩu dẫn đường cho tâm hồn tươi mới.',
    predictiveMeaningVi:
      'Đánh dấu một giai đoạn nghỉ ngơi, thanh tẩy và chữa lành. Sự phục hồi tinh thần đang ở rất gần; việc nhận ra hướng đi đúng đắn (Ngôi Sao Bắc Đẩu) trở nên nhẹ nhàng và đầy hy vọng.',
    adviceVi:
      'Cứ bình tĩnh, thư giãn và tận hưởng khoảng lặng này. Hãy làm bất cứ điều gì giúp phục hồi tâm trí, cơ thể và cảm xúc, đồng thời học cách bước theo ánh sáng dẫn đường của mình.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang tự che giấu ánh sáng của bản thân không? Mình có thể tìm thấy sự chữa lành và tươi mới mình cần ở nơi đâu?',
    sourcePages: 'pp. 27-28',
  },
  'the-moon': {
    cardId: 'the-moon',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Dưới ánh trăng huyền ảo nơi ranh giới thật-giả nhoà đi, nỗi sợ tiềm thức trồi lên như sinh vật dưới đáy nước, đòi hỏi The Fool phải ngước nhìn Ngôi Sao Bắc Đẩu thay vì tin vào ảo giác.',
    predictiveMeaningVi:
      'Cho dù bạn tưởng mình đã biết toàn bộ sự thật, vẫn còn những tầng ẩn khuất chưa lộ diện. Mọi thứ đang mơ hồ cả bên trong lẫn bên ngoài; bóng tối chỉ là tạm thời trước khi ánh ban ngày trở lại.',
    adviceVi:
      'Đừng vội đưa ra quyết định dứt khoát ngay lúc này. Hãy đào sâu dưới bề mặt để phân biệt thật giả, hoặc kiên nhẫn chờ đợi để thời gian phơi bày mọi thứ.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang dùng sự hoang mang làm cái cớ trốn tránh trách nhiệm không? Mình có đang cố ý đặt bản thân vào tình huống mập mờ hay nguy hiểm không?',
    sourcePages: 'pp. 28-29',
  },
  'the-sun': {
    cardId: 'the-sun',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Vượt qua vùng đất mờ sương của The Moon, The Fool đón ánh bình minh rực rỡ và nhìn thấy thành quả rõ ràng từ mọi nỗ lực chân thành của mình.',
    predictiveMeaningVi:
      'Lá bài của sự thành thật, niềm vui thuần khiết, hạnh phúc minh bạch và nguồn năng lượng sống dồi dào.',
    adviceVi:
      'Hãy buông bỏ nỗi lo âu, trân trọng khoảng thời gian tươi đẹp này, tận hưởng từng phút giây và bày tỏ lòng biết ơn sâu sắc.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: mình có đang ép bản thân phải giả vờ vui vẻ không? Mình có đang nhắm mắt làm ngơ trước vấn đề thật sự hoặc tự tạo ra vấn đề khi mọi thứ vốn ổn thoả không?',
    sourcePages: 'pp. 30-31',
  },
  'judgment': {
    cardId: 'judgment',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Giữa tiếng nhạc của những tinh cầu, The Fool nghe thấy "tiếng gọi" cao cả hơn — khao khát chia sẻ món quà và con người chân thật của mình với thế giới.',
    predictiveMeaningVi:
      'Không phải sự phán xét khắt khe, mà là sự kết nối với giọng nói nội tâm và "tiếng gọi" sứ mệnh: bạn nhận được sự sáng tỏ về nhiệm vụ hoặc con đường đầy niềm vui mà linh hồn muốn đảm nhận.',
    adviceVi:
      'Bạn đang cảm nhận một điều gì đó thật lớn lao và thuần khiết — đừng nghi ngại nữa, hãy tiến hành ngay vì tiếng gọi ấy xuất phát từ nơi tốt đẹp nhất bên trong bạn.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: tại sao mình lại ngó lơ những điều mình biết mình nên làm? Mình có đang bóp méo "tiếng gọi" cho vừa vặn với sự tiện nghi cá nhân không?',
    sourcePages: 'pp. 31-32',
  },
  'the-world': {
    cardId: 'the-world',
    suitIntroVi: MAJOR_INTRO_VI,
    storyVi:
      'Hành trình lớn của The Fool khép lại trọn vẹn khi anh đạt được sự thấu hiểu, trí tuệ và kết nối linh thiêng, sẵn sàng bước vào một chu kỳ phiêu lưu mới ở tầm cao hơn.',
    predictiveMeaningVi:
      'Khoảnh khắc quan trọng để công nhận thành tựu lớn lao bạn vừa hoàn thành. Mọi công sức bạn bỏ ra đều được đền đáp xứng đáng.',
    adviceVi:
      'Hãy tận hưởng giai đoạn viên mãn này, đón nhận lời chúc mừng và tự thưởng cho bản thân, đồng thời bắt đầu suy nghĩ về chương tiếp theo.',
    reversedMeaningVi:
      'Hãy tự hỏi mình: tại sao mình vẫn thấy thành quả này chưa đủ tốt? Mình có đang tự áp đặt chủ nghĩa hoàn hảo phi thực tế khiến bản thân không thể tự hào không?',
    sourcePages: 'pp. 32-33',
  },

  // ================= MINOR ARCANA: WANDS (14) =================
  'ace-of-wands': {
    cardId: 'ace-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Vũ trụ đang trao cho bạn một món quà, một cơ hội. Có điều gì đó bạn muốn thể hiện hoặc tạo ra và Ace of Wands giống như dấu hiệu đồng thuận cực lớn để bạn tiến về phía trước và gieo mình vào dự án hoặc sự nghiệp mới.',
    adviceVi: 'Cứ làm đi.',
    reversedMeaningVi: 'Một cơ hội bị bỏ lỡ, trì hoãn, không thoả mãn.',
    sourcePages: 'pp. 34-35',
  },
  'two-of-wands': {
    cardId: 'two-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Thế giới xung quanh mở ra nhiều lựa chọn và cơ hội, nhưng thời gian và năng lượng có hạn nên bạn buộc phải chọn lọc. Tin tốt là các lựa chọn đều đầy triển vọng.',
    adviceVi: 'Hãy chọn cái nào thoả mãn niềm đam mê của bạn hoặc khiến bạn thấy hứng thú nhất.',
    reversedMeaningVi: 'Chần chừ, thoả thuận không được, thiếu tầm nhìn.',
    sourcePages: 'p. 35',
  },
  'three-of-wands': {
    cardId: 'three-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Những lựa chọn và hành động ban đầu đã mang lại dấu hiệu thành công, nhưng câu chuyện vẫn chưa kết thúc. Giờ là lúc chờ đợi "con thuyền" chở thành quả cập bến.',
    adviceVi:
      'Hãy sử dụng khoảng thời gian này để giúp mọi việc diễn ra trôi chảy và lên kế hoạch cho bước tiếp theo.',
    reversedMeaningVi: 'Trì hoãn, mất hết can đảm, những sự lựa chọn tồi tệ, phân tâm.',
    sourcePages: 'p. 36',
  },
  'four-of-wands': {
    cardId: 'four-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Chỉ ra một dịp ăn mừng trang trọng, cơ hội để bạn cùng bạn bè, gia đình hoặc đồng nghiệp công nhận tất cả nỗ lực bạn đã bỏ ra nhằm đạt mục tiêu.',
    adviceVi: 'Hãy tham gia vào sự kiện này, hãy thưởng thức nó.',
    reversedMeaningVi: 'Ăn mừng quá sớm, kế hoạch đổ vỡ.',
    sourcePages: 'p. 37',
  },
  'five-of-wands': {
    cardId: 'five-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Cuộc cạnh tranh thân thiện hoặc buổi thảo luận sôi nổi giúp mọi người cùng phát huy năng lực tốt nhất và chia sẻ sáng kiến.',
    adviceVi: 'Hãy cố gắng hết sức mình nhưng nên nhớ phải chơi đẹp đấy nhé.',
    reversedMeaningVi: 'Kiêu ngạo, đấu đá, chỉ trích gây tổn thương.',
    sourcePages: 'p. 38',
  },
  'six-of-wands': {
    cardId: 'six-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Chiến thắng và sự công nhận thành tựu! Bạn xứng đáng với kết quả này sau khi vận dụng hết kĩ năng và ý chí, nhưng thắng lợi cũng có phần đóng góp từ những người đã hỗ trợ bạn.',
    adviceVi:
      'Hãy khiêm tốn và đừng mong người ta chú ý tới mình. Hãy trân trọng những người đã hỗ trợ và tiếp tục sát cánh bên bạn.',
    reversedMeaningVi: 'Thất bại, xấu hổ, vô tâm, chiếm đoạt công sức của người khác.',
    sourcePages: 'p. 39',
  },
  'seven-of-wands': {
    cardId: 'seven-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Hãy phòng vệ! Có điều gì đó rất đáng bảo vệ — bản thân bạn, một ý tưởng hoặc một người nào đó — trước áp lực hay công kích từ nhiều phía.',
    adviceVi: 'Biết được điều gì đúng đắn trong trường hợp này và có lòng dũng cảm để đứng lên.',
    reversedMeaningVi: 'Phản ứng thái quá, trở nên dễ dàng bị tấn công, gây sự, bảo vệ thứ không xứng đáng.',
    sourcePages: 'p. 40',
  },
  'eight-of-wands': {
    cardId: 'eight-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Mọi sự kiện đã vào đúng quỹ đạo và sẵn sàng bứt tốc cho ra kết quả hợp logic, có thể nhanh hơn dự kiến. Nếu ngăn cản lúc này sẽ gây hỗn loạn không đáng.',
    adviceVi: 'Bạn đã hoàn thành tất cả công việc cần thiết rồi, hãy lùi lại một chút và xem mọi thứ diễn ra thế nào thôi.',
    reversedMeaningVi: 'Hỗn loạn, lộn xộn, trì hoãn.',
    sourcePages: 'p. 41',
  },
  'nine-of-wands': {
    cardId: 'nine-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Hãy chuẩn bị tinh thần và cẩn thận hết mức: một trận chiến hoặc vòng lặp mệt nhọc trong công việc hay quan hệ sắp tái diễn nếu không có sự thay đổi căn bản.',
    adviceVi: 'Hãy sẵn sàng để chiến đấu lại một lần nữa, hoặc tìm ra cách ngăn chặn vòng xoay sản sinh ra vấn đề này.',
    reversedMeaningVi: 'Sự chịu đựng đoạ đày, phản bội, bướng bỉnh.',
    sourcePages: 'p. 42',
  },
  'ten-of-wands': {
    cardId: 'ten-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Việc nói "Có!" với quá nhiều cơ hội và ôm đồm quá nhiều nhiệm vụ khiến bạn bị phân tán mỏng và đứng bên bờ vực kiệt sức hoặc bỏ cuộc.',
    adviceVi:
      'Hãy kiểm tra những thứ bạn mang theo trong người, quyết định thứ gì nên giữ và tìm cách tốt hơn để quản lý gánh nặng.',
    reversedMeaningVi: 'Kiệt sức về mặt vật lý lẫn tâm linh, sự áp bức, sự trì hoãn, sự phân tâm.',
    sourcePages: 'p. 43',
  },
  'page-of-wands': {
    cardId: 'page-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Người trẻ tuổi hoặc tâm thế mới mẻ khám phá ra điều thổi bùng ngọn lửa đam mê, thôi thúc học hỏi và trải nghiệm; lòng nhiệt tình dễ lan toả nhưng kinh nghiệm vẫn cần trau dồi thêm.',
    adviceVi:
      'Hãy lắng nghe sự vui thú trong nội tâm và dũng cảm đón nhận nhiệm vụ mới, bắt đầu chuyến hành trình phiêu lưu phía trước.',
    reversedMeaningVi: 'Quá phụ thuộc vào lời nhận xét bên ngoài, giận dữ hoặc nản chí khi gặp thất bại.',
    sourcePages: 'p. 44',
  },
  'knight-of-wands': {
    cardId: 'knight-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Được dẫn dắt bởi nhiệm vụ đầy nhiệt huyết, tập trung mãnh liệt vào một mục tiêu duy nhất; dễ thành công nhưng tầm nhìn hạn hẹp có nguy cơ bỏ sót điều quan trọng hoặc quên ghi nhận người hỗ trợ.',
    adviceVi:
      'Hãy theo đuổi mục tiêu lớn lao nhưng nhớ trân trọng và giữ gìn những giá trị an toàn khi chạm tay tới điều mình tìm kiếm.',
    reversedMeaningVi: 'Vội vàng vô ích, đạp lên trên người khác, theo đuổi giấc mơ sai lầm.',
    sourcePages: 'p. 45',
  },
  'queen-of-wands': {
    cardId: 'queen-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Thấu hiểu và làm chủ sức mạnh cá nhân bằng sự tự tin, duyên dáng và lịch thiệp, truyền cảm hứng cho người khác — nhưng cần tránh vô tình kiểm soát khi họ chưa sẵn sàng.',
    adviceVi:
      'Hãy biết mình là ai cùng giới hạn của sức mạnh cá nhân và sử dụng nó hợp lý để khích lệ người xung quanh.',
    reversedMeaningVi: 'Huênh hoang, tự phụ, kiểm soát, lạm dụng sức mạnh cá nhân, chối bỏ tiềm năng của chính mình.',
    sourcePages: 'p. 46',
  },
  'king-of-wands': {
    cardId: 'king-of-wands',
    suitIntroVi: WANDS_INTRO_VI,
    predictiveMeaningVi:
      'Yêu thích hành động và quyết định để phục vụ mục tiêu lớn lao hơn bản thân như kinh doanh, lý tưởng hoặc hợp tác; phát huy đỉnh cao khi kiến tạo thực tế nhưng dễ chán nản trước việc vặt trần tục.',
    adviceVi:
      'Hãy tìm một nguyên nhân hữu ích để trao năng lượng và năng lực, tham gia vào điều lớn lao hơn bản thân để tạo nên sự khác biệt.',
    reversedMeaningVi: 'Thiếu chú tâm đến những vấn đề cảm xúc, lập luận cứng nhắc, chỉ quan tâm đến vấn đề vật lý.',
    sourcePages: 'p. 47',
  },

  // ================= MINOR ARCANA: CUPS (14) =================
  'ace-of-cups': {
    cardId: 'ace-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Bạn sắp nhận được chiếc cúp chứa liều thuốc chữa lành làm dịu linh hồn và xoa dịu vết thương. Sự chữa lành bắt đầu từ lòng tha thứ cho bản thân và người khác, mở ra cơ hội hàn gắn mối quan hệ.',
    adviceVi: 'Bạn đang được trao một món quà của tình yêu. Đừng trở nên kiêu ngạo, hãy đón nhận nó và đưa đôi bàn tay tình bạn ra để bắt đầu lại.',
    reversedMeaningVi: 'Sự phẫn uất.',
    sourcePages: 'pp. 48-49',
  },
  'two-of-cups': {
    cardId: 'two-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Khoảnh khắc hai ánh mắt đồng điệu giữa căn phòng nhộn nhịp — một kết nối lãng mạn, tri kỷ hoặc đối tác làm ăn đầy hứa hẹn về sự gắn kết sâu sắc.',
    adviceVi:
      'Hãy cởi mở và lạc quan về mối quan hệ mới này, tận hưởng phép màu thuần khiết của nó và đừng huỷ hoại bằng những kỳ vọng nặng nề.',
    reversedMeaningVi: 'Sự từ chối, nhìn qua lăng kính màu hồng ảo tưởng, tình yêu không được đền đáp, sự mê dại.',
    sourcePages: 'p. 49',
  },
  'three-of-cups': {
    cardId: 'three-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Sự ấm áp và toả sáng khi hội ngộ bạn bè thân thiết; ở bên những người hiểu mình giúp bạn được là chính mình và trở nên rạng rỡ hơn.',
    adviceVi: 'Hãy tận hưởng sự thoải mái và niềm vui khi gặp gỡ bạn bè; nếu chưa có kế hoạch, hãy sắp xếp thời gian sum họp.',
    reversedMeaningVi: 'Bạn bè có ác ý, cảm thấy bị bỏ rơi, tiệc tùng quá nhiều.',
    sourcePages: 'p. 50',
  },
  'four-of-cups': {
    cardId: 'four-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Cảm giác buồn chán và thờ ơ với những gì đang có hoặc những cơ hội được đưa tới, đôi khi là khoảng lặng tự nhiên sau những biến cố tình cảm hay gia đình.',
    adviceVi:
      'Nếu cần thiết cứ dành ít thời gian cho riêng mình, nhưng đừng chìm quá lâu — hãy mở mắt nhìn xung quanh và nắm lấy những điều tốt đẹp đang hiện diện.',
    reversedMeaningVi: 'Buồn rầu sâu sắc, sự bất mãn có tính cường điệu, thiếu sự biết ơn.',
    sourcePages: 'p. 51',
  },
  'five-of-cups': {
    cardId: 'five-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Phản ứng cảm xúc trước sự mất mát và nhu cầu được ở riêng với nỗi buồn. Hai chiếc cúp còn đứng thẳng nhắc rằng vẫn còn điều sót lại có thể an ủi bạn và con đường trở về cộng đồng vẫn mở.',
    adviceVi:
      'Hãy dành thời gian tiếp nhận trọn vẹn cảm xúc của mình vì đó là cách duy nhất để bước tiếp vào cuộc sống thường nhật mới mẻ hơn.',
    reversedMeaningVi: 'Ám ảnh quá khứ, tự ti, kìm nén hoặc kiểm soát nỗi buồn khổ thái quá.',
    sourcePages: 'p. 52',
  },
  'six-of-cups': {
    cardId: 'six-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Những hành động tử tế nhỏ bé xuất phát từ trái tim hoặc ký ức đẹp trong quá khứ tạo nên sự ngọt ngào lan toả. Người trao đi lời chúc lành không hề mang mưu mô toan tính.',
    adviceVi:
      'Hãy tiếp nhận món quà chân thành và đừng nghi ngờ; nếu bạn là người trao đi, hãy hành động thật tử tế mà không gài thêm cảm xúc nặng nề.',
    reversedMeaningVi: 'Lãng mạn hoá quá khứ, thao túng cảm xúc, những món quà có toan tính đi kèm.',
    sourcePages: 'p. 53',
  },
  'seven-of-cups': {
    cardId: 'seven-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Có rất nhiều lựa chọn và cám dỗ trước mắt — một số là cơ hội thật, số khác chỉ là ảo ảnh hoặc nỗi sợ khiến trái tim khó phân định.',
    adviceVi:
      'Hãy lùi lại một bước để có cái nhìn bao quát hơn, phân tích thật logic và hợp lý để định hướng phản hồi cảm xúc đúng đắn.',
    reversedMeaningVi: 'Những giấc mơ ban ngày đang len lỏi vào cuộc sống, chủ nghĩa thoát ly thực tế, những ảo tưởng.',
    sourcePages: 'p. 54',
  },
  'eight-of-cups': {
    cardId: 'eight-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Dù mọi thứ bề ngoài có vẻ ổn thoả — một công việc, mối quan hệ hay lối sống tưởng như hoàn hảo — trái tim bạn vẫn biết rõ chúng không còn dành cho mình nữa và đã đến lúc bước tiếp.',
    adviceVi:
      'Hãy dũng cảm lắng nghe trái tim mình dù khó giải thích với người khác; ở lại chỉ làm tăng thêm phần đắng cay.',
    reversedMeaningVi: 'Chấp nhận lựa chọn thứ yếu, oán giận, chạy trốn vì sợ hãi.',
    sourcePages: 'p. 55',
  },
  'nine-of-cups': {
    cardId: 'nine-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Lá bài Nguyện Ước: bạn đã đưa ra những lựa chọn tốt và tự tay đạt được kết quả làm mình hài lòng; ngay trong khoảnh khắc này cuộc đời thật tươi đẹp.',
    adviceVi: 'Hãy đếm những điều may mắn bạn có được, thể hiện lòng biết ơn và chia sẻ điều tốt đẹp với người khác.',
    reversedMeaningVi: 'Quá nuông chiều bản thân, ích kỉ, không hài lòng, hối tiếc.',
    sourcePages: 'p. 56',
  },
  'ten-of-cups': {
    cardId: 'ten-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Cái kết "hạnh phúc mãi mãi về sau" của sự vun đắp các mối quan hệ: cảm giác bình an, hoà hợp gia đình và cùng nhau chia sẻ giấc mơ chung hướng về tương lai.',
    adviceVi:
      'Hãy thật sự tận hưởng cảm giác này, khắc ghi vào tim và đảm bảo những người bạn yêu thương biết rõ tình cảm của bạn để làm điểm tựa khi khó khăn.',
    reversedMeaningVi: 'Tương lai giả tạo, cãi vã trong gia đình, những lời hứa hẹn hoặc thề ước đã tan vỡ.',
    sourcePages: 'p. 57',
  },
  'page-of-cups': {
    cardId: 'page-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Trải nghiệm một cảm xúc hay rung động như thể lần đầu tiên — chân thành, đắm chìm và có thể mở ra một mối quan hệ hay trải nghiệm quan trọng nhất đời, dù cần tỉnh táo để không bị che mắt.',
    adviceVi:
      'Hãy dấn thân vào biển trải nghiệm cảm xúc đó nhưng nhớ mở mắt quan sát; giữ cân bằng để mở rộng trái tim mà vẫn bảo vệ nó an toàn.',
    reversedMeaningVi: 'Tự cho là mình biết hết, từ chối sự hướng dẫn, làm lơ những dấu hiệu cảnh báo.',
    sourcePages: 'p. 58',
  },
  'knight-of-cups': {
    cardId: 'knight-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Người truy tìm lý tưởng tinh tế và chiếc chén thánh của trái tim mình với tất cả sự lãng mạn, di chuyển chậm rãi nhưng chú tâm sâu sắc đến mức đôi khi quên mất thực tại.',
    adviceVi: 'Bạn hiểu rõ lý tưởng của mình ra sao, vậy đừng thoả hiệp ít hơn thế; hãy tận hưởng hành trình nhưng đừng để mình phân tâm.',
    reversedMeaningVi: 'Đầu để trên mây, nuông chiều theo chủ nghĩa lãng mạn, đãng trí thiếu thực tế.',
    sourcePages: 'p. 59',
  },
  'queen-of-cups': {
    cardId: 'queen-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Thoả mãn sâu sắc qua việc kết nối chân thành, cực kỳ nhạy cảm, giàu trực giác và tâm linh; tạo cảm giác gần gũi nhưng đôi khi dễ chìm vào buồn rầu bởi cảm xúc riêng.',
    adviceVi:
      'Hãy lắng nghe và trân trọng cảm xúc của mình nhưng đừng để chúng chiếm lĩnh toàn bộ con người bạn; cho cảm xúc lắng lại tự nhiên trước khi hành động.',
    reversedMeaningVi: 'Quá dựa dẫm đòi hỏi, đồng phụ thuộc, che giấu người khác, bị cảm xúc kiểm soát.',
    sourcePages: 'p. 60',
  },
  'king-of-cups': {
    cardId: 'king-of-cups',
    suitIntroVi: CUPS_INTRO_VI,
    predictiveMeaningVi:
      'Hành động bằng trái tim dù có kinh nghiệm và quyền lực; chăm chỉ kiến tạo kết nối sâu sắc trong gia đình hoặc tổ chức, nhưng nếu mọi việc không như ý dễ rơi vào hờn dỗi thao túng.',
    adviceVi:
      'Hãy để trái tim và khát vọng tạo nên tình yêu và những cây cầu kết nối để đưa hành động của bạn đi xa hơn.',
    reversedMeaningVi: 'Mất kết nối cảm xúc, hờn dỗi kiểu trẻ con, u sầu.',
    sourcePages: 'p. 61',
  },

  // ================= MINOR ARCANA: SWORDS (14) =================
  'ace-of-swords': {
    cardId: 'ace-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Kiếm là vũ khí hai lưỡi: lá bài báo hiệu sự thật rõ ràng, ý tưởng tươi sáng đột ngột lóe lên và giải pháp trí tuệ tháo gỡ vấn đề khó khăn — kèm lời cảnh báo phải dùng sự thật ấy với tình yêu thương.',
    adviceVi: 'Hãy dùng ý tưởng, giải pháp và sự thật này với tất cả tình yêu; bạn được trao món quà để phục hồi hoà bình chứ không phải huỷ diệt.',
    reversedMeaningVi: 'Logic đầy khuyết điểm, giao tiếp kém, bất công, chần chừ.',
    sourcePages: 'pp. 62-63',
  },
  'two-of-swords': {
    cardId: 'two-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Đứng trước một lựa chọn mà bạn đã biết đâu là điều đúng đắn, nhưng nỗi sợ hoặc sự luyến tiếc lựa chọn còn lại khiến cảm xúc chen ngang làm bạn bế tắc.',
    adviceVi: 'Sự trì hoãn chỉ khiến mọi thứ tệ hơn. Bạn không thể kéo dài tình trạng này nữa — hãy dứt khoát làm điều bạn thấy đúng đắn.',
    reversedMeaningVi: 'Ngó lơ một vấn đề, từ chối tiếp nhận sự thật, lừa dối chính bản thân mình.',
    sourcePages: 'p. 63',
  },
  'three-of-swords': {
    cardId: 'three-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Sự thật và lời nói có thể cứa sâu gây vết thương lòng. Dù bạn có chủ động hỏi hay không, sự thật đã phơi bày và làm thay đổi mọi thứ; sẽ cần trải qua đau đớn trước khi được chữa lành.',
    adviceVi:
      'Hãy thừa nhận và chấp nhận sự thật thay vì chối bỏ nỗi đau; tập trung chữa trị và thứ tha để những thanh kiếm không mãi đầu độc trái tim.',
    reversedMeaningVi: 'Bối rối, hiểm độc, những lời dối gian đầy đớn đau, sự tàn độc.',
    sourcePages: 'p. 64',
  },
  'four-of-swords': {
    cardId: 'four-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Vấn đề tưởng như bế tắc vì đầu óc quá rối bời; lá bài kêu gọi rút lui, nghỉ ngơi, phục hồi và tái tập hợp. Giải pháp đơn giản và tinh tế sẽ chỉ hiện ra khi tâm trí trở nên quang đãng.',
    adviceVi: 'Hãy để vấn đề lặng yên một thời gian — gặm nhấm nó không giúp bạn tiến gần hơn. Hãy thiền định, cầu nguyện và ngủ đủ giấc.',
    reversedMeaningVi: 'Chối bỏ, ám ảnh, trì hoãn, hỗn loạn.',
    sourcePages: 'p. 65',
  },
  'five-of-swords': {
    cardId: 'five-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Trận chiến đã kết thúc với kẻ thắng và người thua, nhưng ngay cả người chiến thắng cũng đánh mất vinh quang, sự gắn kết và bạn bè giữa những nuối tiếc, cay nghiệt.',
    adviceVi:
      'Nếu xung đột đã xảy ra, hãy chuẩn bị nguồn lực phục hồi để bước tiếp; nếu chưa xảy ra, hãy tìm cách giải quyết mâu thuẫn tốt đẹp hơn.',
    reversedMeaningVi: 'Chiến thắng phải trả giá đắt, ô nhục, hành vi đầy xấu hổ.',
    sourcePages: 'p. 66',
  },
  'six-of-swords': {
    cardId: 'six-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Một số tình huống hoặc mối quan hệ không thể cứu vãn được nữa; rời đi tới nơi an toàn hơn trên dòng nước lặng tuy không dễ dàng nhưng sẽ mang lại ánh nắng và điểm tựa tái thiết mới.',
    adviceVi: 'Hãy tránh khỏi tình huống đó để giữ khoảng cách đủ xa — chỉ khi lùi ra xa bạn mới nhìn rõ thứ mình đang đối mặt.',
    reversedMeaningVi: 'Trì hoãn, vướng mắc, chọn ở nguyên vị trí trong một tình huống tồi tệ.',
    sourcePages: 'p. 67',
  },
  'seven-of-swords': {
    cardId: 'seven-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Một kế hoạch khôn lỏi hoặc lén lút tưởng chừng trót lọt nhưng vẫn có ánh mắt dõi theo và để lại cái giá phải trả không đơn giản.',
    adviceVi:
      'Nếu có thể hãy suy nghĩ lại kế hoạch của mình; nếu không, hãy minh bạch rõ ràng và đừng làm tình hình tệ hơn bằng sự che giấu.',
    reversedMeaningVi: 'Một kế hoạch thất bại, phơi bày, bắt quả tang.',
    sourcePages: 'p. 68',
  },
  'eight-of-swords': {
    cardId: 'eight-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Cảm giác bị trói buộc và bủa vây không lối thoát cả nghĩa đen lẫn nghĩa bóng — nhưng vì thuộc bộ Swords, tình trạng bế tắc này phần lớn được tạo ra hoặc khuếch đại bởi chính cách suy nghĩ của bạn.',
    adviceVi:
      'Như nghệ sĩ thoát hiểm Houdini, bạn có thể tự giải phóng mình bằng cách chế ngự nỗi sợ đang trỗi dậy và nhìn nhận tình huống theo góc độ hoàn toàn khác.',
    reversedMeaningVi: 'Nguỵ biện, tâm lý nạn nhân, tự gây ra rắc rối.',
    sourcePages: 'p. 69',
  },
  'nine-of-swords': {
    cardId: 'nine-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Những nỗi âu lo, hối tiếc và ám ảnh lúc nửa đêm nuôi lớn cơn ác mộng khiến tinh thần bạn ngày càng suy kiệt cho tới mức một lời nói bất cẩn cũng làm bạn bất an.',
    adviceVi:
      'Đừng chịu đựng một mình: hãy thử thiền định, viết ra danh sách giải quyết hoặc thức dậy làm việc có ích để cắt đứt vòng xoáy lo âu.',
    reversedMeaningVi: 'Cô lập, mất ngủ triền miên, quá dựa dẫm vào thuốc an thần hoặc trốn tránh.',
    sourcePages: 'p. 70',
  },
  'ten-of-swords': {
    cardId: 'ten-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Tình huống đã thực sự khép lại và thiệt hại đã xảy ra, không thể quay về nguyên trạng cũ. Nhưng ánh hoàng hôn cũng báo hiệu bình minh mới: bài học rút ra sẽ mở đường cho ngày mới.',
    adviceVi:
      'Đừng lãng phí sức lực cố thay đổi kết quả đã định; hãy mang theo bài học kinh nghiệm để bước tới một tương lai khác tốt đẹp hơn.',
    reversedMeaningVi: 'Cường điệu nỗi đau, sự chối từ, không chịu buông bỏ.',
    sourcePages: 'p. 71',
  },
  'page-of-swords': {
    cardId: 'page-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Thông minh, học hỏi nhanh nhưng cũng dễ chán; góc nhìn còn non nớt chỉ phân biệt Trắng-Đen nên đôi khi vô tình trở nên nhiều chuyện, sắc bén và hay phán xét.',
    adviceVi:
      'Hãy ghi nhận sự hiểu biết của bản thân nhưng đừng quên những gì mình chưa biết; giảm phán xét và nuôi dưỡng tinh thần ham học hỏi.',
    reversedMeaningVi: 'Thái độ biết tuốt, giả vờ thông minh, đùa cợt thô lỗ làm tổn thương người khác.',
    sourcePages: 'p. 72',
  },
  'knight-of-swords': {
    cardId: 'knight-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Tập trung cao độ vào mục tiêu với ngôn từ sắc bén và logic thuyết phục để bảo vệ điều mình tin là sự thật — nhưng sức mạnh ngôn từ đòi hỏi trách nhiệm kiểm chứng toàn cảnh.',
    adviceVi:
      'Đừng đánh đồng sự thật của riêng bạn là chân lý của tất cả mọi người; hãy xem xét cả góc nhìn đối lập trước khi tranh đấu.',
    reversedMeaningVi: 'Thiếu kế hoạch hoặc chiến thuật rõ ràng, quá cứng nhắc, không thấy phát triển mới, cố chấp không tha thứ.',
    sourcePages: 'p. 73',
  },
  'queen-of-swords': {
    cardId: 'queen-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Trải qua đủ thăng trầm để đúc kết triết lý sáng suốt thay vì cay đắng; nhận thức rõ ràng, nhìn thấu lời dối gian và lập kế hoạch sắc sảo, đôi khi trông có vẻ lạnh lùng vì đề cao logic.',
    adviceVi:
      'Hãy biến mọi trải nghiệm cuộc đời thành bài học hữu ích; để thử thách tôi luyện bạn mạnh mẽ hơn chứ đừng trở nên hoài nghi hay lạnh giá.',
    reversedMeaningVi: 'Sự đắng cay, chủ nghĩa hoài nghi, lạnh lùng, khó gần, lời nói sắc bén thô lỗ.',
    sourcePages: 'p. 74',
  },
  'king-of-swords': {
    cardId: 'king-of-swords',
    suitIntroVi: SWORDS_INTRO_VI,
    predictiveMeaningVi:
      'Phụng sự lý tưởng cao hơn bằng logic, lý lẽ, sự công minh và kinh nghiệm quá khứ; hiểu rõ sức nặng của ngôn từ nên thận trọng tuyệt đối, dù đôi lúc dễ quên xét đến cảm xúc người khác.',
    adviceVi: 'Hãy tập hợp đầy đủ thông tin, sắp xếp thật logic và chắc chắn về điều mình suy xét trước khi hành động.',
    reversedMeaningVi: 'Màu mè, hoang tưởng, phán xét, kiểm soát, thô lỗ, hèn hạ.',
    sourcePages: 'p. 75',
  },

  // ================= MINOR ARCANA: COINS / PENTACLES (14) =================
  'ace-of-coins': {
    cardId: 'ace-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Lá Ace may mắn nhất: hạt giống chứa đựng mọi tiềm năng thịnh vượng về vật chất, tài chính, sức khoẻ và các mối quan hệ đủ đầy đang chờ được nuôi dưỡng để khai hoa nở nhụy.',
    adviceVi: 'Mơ ước thật lớn và làm việc thật chăm chỉ; vũ trụ đang trao cho bạn một món quà thực tiễn — hãy đầu tư thật tốt.',
    reversedMeaningVi: 'Cơ hội bị bỏ lỡ, thiếu nguồn lực, chạy theo tiền bạc chỉ vì nỗi sợ bất an.',
    sourcePages: 'pp. 76-77',
  },
  'two-of-coins': {
    cardId: 'two-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Phải khéo léo giữ thăng bằng giữa nhiều đầu việc bấp bênh cùng lúc. Bạn vẫn xoay xở tốt nhưng trạng thái căng mình như thế không thể kéo dài mãi.',
    adviceVi:
      'Duy trì tình trạng này rất mệt mỏi; hãy tái ưu tiên ngay khi có thể, nếu không hoàn cảnh sẽ tự ép bạn phải buông bỏ bớt.',
    reversedMeaningVi: 'Hỗn loạn, căng thẳng, tình hình tài chính nghèo nàn, chi tiêu không đúng cách.',
    sourcePages: 'p. 77',
  },
  'three-of-coins': {
    cardId: 'three-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Làm việc nhóm đạt thành tựu lớn khi mỗi người đặt cái tôi sang một bên và đóng góp kĩ năng độc đáo của mình; cũng có thể là tình huống một cá nhân vận dụng đa dạng tài năng để tạo kiệt tác.',
    adviceVi:
      'Hãy nhớ tất cả đều cùng chung mục tiêu; dốc hết sức mình cho dự án và hỗ trợ để mọi khâu vận hành trơn tru.',
    reversedMeaningVi: 'Công việc thiếu giá trị, đồng đội không phối hợp vì nhau, đóng góp không được công nhận, dự án không xứng đáng.',
    sourcePages: 'p. 78',
  },
  'four-of-coins': {
    cardId: 'four-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Dù tài nguyên vốn để lưu thông, đây là lúc tiết kiệm, giữ vững nguồn lực và đầu tư khôn ngoan để chuẩn bị cho một chuyến đi hay dự định lớn sắp tới.',
    adviceVi: 'Hãy cẩn trọng với túi tiền và cắt giảm chi tiêu không cần thiết; tích luỹ sức lực và tài nguyên cho lúc cần.',
    reversedMeaningVi: 'Tham lam, đầu cơ tích trữ, lấy thứ không thuộc về mình, lãng phí nguồn lực.',
    sourcePages: 'p. 79',
  },
  'five-of-coins': {
    cardId: 'five-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Giai đoạn khó khăn về tài chính hoặc sức khoẻ khiến bạn dễ tự trách và mất niềm tin, ngại ngần không dám mở lời nhờ giúp đỡ — nhưng khó khăn lúc này không định nghĩa bạn là kẻ thất bại.',
    adviceVi: 'Đừng quá khắt khe với bản thân; hãy mạnh dạn yêu cầu sự giúp đỡ và đón nhận nó bằng lòng biết ơn.',
    reversedMeaningVi: 'Bỏ bê bản thân, từ chối sự giúp đỡ, lợi dụng người khác.',
    sourcePages: 'p. 80',
  },
  'six-of-coins': {
    cardId: 'six-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Sự phân phối các nguồn lực giữa người đang nắm giữ và người cần hỗ trợ — cân nhắc trao đi công bằng hay chia sẻ đúng nơi đúng lúc.',
    adviceVi: 'Bạn có năng lực giúp đỡ người khác và nên làm điều đó thật tử tế, nhẹ nhàng để giữ gìn phẩm giá cho người nhận.',
    reversedMeaningVi: 'Keo kiệt, từ chối giúp đỡ, bất công, không sẵn sàng đón nhận hoặc không thể giúp người khác.',
    sourcePages: 'p. 81',
  },
  'seven-of-coins': {
    cardId: 'seven-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Dự án đang tiến triển tốt và sắp đến ngày thu hoạch, nhưng mọi thứ vẫn đang trong quá trình chín muồi nên vội vàng gặt hái ngay lúc này sẽ làm hỏng thành quả.',
    adviceVi: 'Trong lúc kiên nhẫn chờ thu hoạch, hãy rà soát và đánh giá lại tiến trình để tối ưu cho những lần tới.',
    reversedMeaningVi: 'Kết quả không như kỳ vọng, thu hoạch quá sớm, không rút kinh nghiệm từ sai lầm.',
    sourcePages: 'p. 82',
  },
  'eight-of-coins': {
    cardId: 'eight-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Cơ hội nâng tầm tay nghề lên bậc tinh thông thông qua sự rèn luyện bền bỉ; với người có đam mê thực thụ, từng thành tựu nhỏ trong quá trình khổ luyện đều mang lại niềm vui.',
    adviceVi: 'Hãy tự hào về công việc bạn làm và nuôi dưỡng sự kiên nhẫn để chăm chỉ trau dồi mỗi ngày.',
    reversedMeaningVi: 'Tay nghề kém, tự mãn làm qua loa, công việc tẻ nhạt không đủ đầy.',
    sourcePages: 'p. 83',
  },
  'nine-of-coins': {
    cardId: 'nine-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Phần thưởng xứng đáng cho công việc hoàn thành xuất sắc và cả một cuộc sống tự chủ được kiến tạo vững vàng nhờ sự đáng tin cậy và óc sáng tạo.',
    adviceVi: 'Bạn đã làm việc chăm chỉ và có quyền tự hào; hãy tận hưởng thành công của mình và cân nhắc chia sẻ niềm vui ấy với người xứng đáng.',
    reversedMeaningVi: 'Không thoả mãn, lười biếng, thấy chẳng thứ gì đủ tốt, lệ thuộc vào sự công nhận bên ngoài.',
    sourcePages: 'p. 84',
  },
  'ten-of-coins': {
    cardId: 'ten-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Gặt hái thành quả vững bền về gia đình, di sản và sự sung túc vật chất đi đôi với chiều sâu tinh thần — trân trọng những điều khiến cuộc sống thật sự đáng sống.',
    adviceVi: '"Nếu thích hoa bạn sẽ hái, nếu yêu hoa bạn sẽ tưới nước" — hãy yêu thương và chăm sóc chu đáo những gì bạn đang có.',
    reversedMeaningVi: 'Nợ nần, vấn đề gia đình, kỳ vọng nặng nề, cố giữ vẻ bề ngoài.',
    sourcePages: 'p. 85',
  },
  'page-of-coins': {
    cardId: 'page-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Hứng thú tìm hiểu cách thế giới vật lý vận hành một cách thực tế và hiệu quả, nhưng vì quen với vùng an toàn nên đôi lúc dễ lười biếng hoặc ngại thay đổi.',
    adviceVi: 'Hãy khám phá thế giới xung quanh và thoả mãn sự tò mò; học hỏi và thực hành chăm chỉ nhưng giữ tâm trí cởi mở trước sự đổi mới.',
    reversedMeaningVi: 'Sự lười biếng, đầu cơ tích trữ, các kĩ năng bị trì trệ.',
    sourcePages: 'p. 86',
  },
  'knight-of-coins': {
    cardId: 'knight-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Tận tụy, trung thành và kiên định; hiểu giá trị của thời gian, biết kiên nhẫn chờ thời điểm chín muồi và giỏi gây dựng giá trị bền vững từ con số không.',
    adviceVi: 'Hãy dành thời gian cho những điều bạn trân quý nhất và bền bỉ trau dồi sự kiên nhẫn.',
    reversedMeaningVi: 'Cẩn thận quá mức, sợ mất mát, do dự, nhạt nhẽo, chán nản.',
    sourcePages: 'p. 87',
  },
  'queen-of-coins': {
    cardId: 'queen-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Bậc thầy kiến tạo môi trường ấm cúng, thoải mái và biến những điều giản dị thành kho báu thực thụ nhờ sự chăm chút tỉ mỉ tới từng chi tiết.',
    adviceVi: 'Hãy tạo ra càng nhiều sự thoải mái và vẻ đẹp cho không gian sống càng tốt, và chú ý đến cả những chi tiết nhỏ nhất.',
    reversedMeaningVi: 'Ám ảnh kết quả cuối cùng, tiêu xài quá mức hoặc tiết kiệm khắc khổ đến cùng.',
    sourcePages: 'p. 88',
  },
  'king-of-coins': {
    cardId: 'king-of-coins',
    suitIntroVi: COINS_INTRO_VI,
    predictiveMeaningVi:
      'Thực tế, chú trọng chất lượng và kết quả cuối cùng; trân trọng những điều tốt đẹp nhưng luôn cân nhắc đầu tư hay trao tặng sao cho tạo tác động lớn nhất cho tổ chức hoặc mục tiêu cao cả.',
    adviceVi: 'Hãy đánh giá cẩn thận các nguồn lực đang có và đầu tư thật thông minh; làm tốt công việc nhưng đừng phung phí.',
    reversedMeaningVi: 'Thích phô trương sang chảnh, nợ nần nặng nề, giàu vật chất nhưng nghèo tinh thần, thiếu lòng trắc ẩn.',
    sourcePages: 'p. 89',
  },
};

export function retrieveGuidebookLore(cardIds: string[]): TarotGuidebookEntry[] {
  return cardIds
    .map((id) => TAROT_MYSTICAL_KB[id])
    .filter((entry): entry is TarotGuidebookEntry => Boolean(entry));
}
